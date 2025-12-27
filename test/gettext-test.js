'use strict';

import Gettext from '../lib/gettext.js';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { describe, beforeEach, it } from 'node:test';

var sinon = require('sinon');

import { getLanguageCode } from '../lib/private.js';
describe('Private', () => {
    describe('getLanguageCode', function () {
        it('should normalize locale string', function () {
            assert.equal(getLanguageCode('ab-cd_ef.utf-8'), 'ab');
            assert.equal(getLanguageCode('ab-cd_ef'), 'ab');
        });
    });
});

describe('Gettext', function () {
    /** @type {Gettext} */
    var gt;
    /** @type {import('gettext-parser').GetTextTranslations} */
    var jsonFile;

    beforeEach(function () {
        gt = new Gettext({ debug: false });
        jsonFile = JSON.parse(
            fs.readFileSync(__dirname + '/fixtures/latin13.json', {
                encoding: 'utf-8',
            }),
        );
    });

    describe('#constructor', function () {
        var gtc;

        beforeEach(function () {
            gtc = null;
        });

        describe('#sourceLocale option', function () {
            it('should accept any string as a locale', function () {
                gtc = new Gettext({ sourceLocale: 'en-US' });
                assert.equal(gtc.sourceLocale, 'en-US');
                gtc = new Gettext({ sourceLocale: '01234' });
                assert.equal(gtc.sourceLocale, '01234');
            });

            it('should default to en empty string', function () {
                assert.equal(new Gettext().sourceLocale, '');
            });

            it('should reject non-string values', function () {
                gtc = new Gettext({ sourceLocale: null });
                assert.equal(gtc.sourceLocale, '');
                gtc = new Gettext({ sourceLocale: 123 });
                assert.equal(gtc.sourceLocale, '');
                gtc = new Gettext({ sourceLocale: false });
                assert.equal(gtc.sourceLocale, '');
                gtc = new Gettext({ sourceLocale: {} });
                assert.equal(gtc.sourceLocale, '');
                gtc = new Gettext({ sourceLocale: function () {} });
                assert.equal(gtc.sourceLocale, '');
            });
        });
    });

    describe('#addTranslations', function () {
        it('should store added translations', function () {
            gt.addTranslations('et-EE', 'messages', jsonFile);

            assert.ok(gt.catalogs['et-EE']);
            assert.ok(gt.catalogs['et-EE'].messages);
            assert.equal(gt.catalogs['et-EE'].messages.charset, 'iso-8859-13');
        });

        it('should store added translations on a custom domain', function () {
            gt.addTranslations('et-EE', 'mydomain', jsonFile);

            assert.ok(gt.catalogs['et-EE'].mydomain);
            assert.equal(gt.catalogs['et-EE'].mydomain.charset, 'iso-8859-13');
        });
    });

    describe('#setLocale', function () {
        it('should have the empty string as default locale', function () {
            assert.equal(gt.locale, '');
        });

        it('should accept whatever string is passed as locale', function () {
            gt.setLocale('de-AT');
            assert.equal(gt.locale, 'de-AT');
            gt.setLocale('01234');
            assert.equal(gt.locale, '01234');
            gt.setLocale('');
            assert.equal(gt.locale, '');
        });

        it('should reject non-string locales', function () {
            gt.setLocale(null);
            assert.equal(gt.locale, '');
            gt.setLocale(123);
            assert.equal(gt.locale, '');
            gt.setLocale(false);
            assert.equal(gt.locale, '');
            gt.setLocale(function () {});
            assert.equal(gt.locale, '');
            gt.setLocale(NaN);
            assert.equal(gt.locale, '');
            gt.setLocale();
            assert.equal(gt.locale, '');
        });
    });

    describe('#setTextDomain', function () {
        it('should default to "messages"', function () {
            assert.equal(gt.domain, 'messages');
        });

        it('should accept and store any string as domain name', function () {
            gt.setTextDomain('mydomain');
            assert.equal(gt.domain, 'mydomain');
            gt.setTextDomain('01234');
            assert.equal(gt.domain, '01234');
            gt.setTextDomain('');
            assert.equal(gt.domain, '');
        });

        it('should reject non-string domains', function () {
            gt.setTextDomain(null);
            assert.equal(gt.domain, 'messages');
            gt.setTextDomain(123);
            assert.equal(gt.domain, 'messages');
            gt.setTextDomain(false);
            assert.equal(gt.domain, 'messages');
            gt.setTextDomain(function () {});
            assert.equal(gt.domain, 'messages');
            gt.setTextDomain(NaN);
            assert.equal(gt.domain, 'messages');
            gt.setTextDomain();
            assert.equal(gt.domain, 'messages');
        });
    });

    describe('Resolve translations', function () {
        beforeEach(function () {
            gt.addTranslations('et-EE', 'messages', jsonFile);
            gt.setLocale('et-EE');
        });

        describe('#dnpgettext', function () {
            it('should return singular match from default context', function () {
                assert.equal(
                    gt.dnpgettext('messages', '', 'o2-1', 'o2-2', 1),
                    't2-1',
                );
            });

            it('should return plural match from default context', function () {
                assert.equal(
                    gt.dnpgettext('messages', '', 'o2-1', 'o2-2', 2),
                    't2-2',
                );
            });

            it('should return singular match from selected context', function () {
                assert.equal(
                    gt.dnpgettext('messages', 'c2', 'co2-1', 'co2-2', 1),
                    'ct2-1',
                );
            });

            it('should return plural match from selected context', function () {
                assert.equal(
                    gt.dnpgettext('messages', 'c2', 'co2-1', 'co2-2', 2),
                    'ct2-2',
                );
            });

            it('should return singular match for non existing domain', function () {
                assert.equal(
                    gt.dnpgettext('cccc', '', 'o2-1', 'o2-2', 1),
                    'o2-1',
                );
            });
        });

        describe('#gettext', function () {
            it('should return singular from default context', function () {
                assert.equal(gt.gettext('o2-1'), 't2-1');
            });
        });

        describe('#dgettext', function () {
            it('should return singular from default context', function () {
                assert.equal(gt.dgettext('messages', 'o2-1'), 't2-1');
            });
        });

        describe('#ngettext', function () {
            it('should return plural from default context', function () {
                assert.equal(gt.ngettext('o2-1', 'o2-2', 2), 't2-2');
            });
        });

        describe('#dngettext', function () {
            it('should return plural from default context', function () {
                assert.equal(
                    gt.dngettext('messages', 'o2-1', 'o2-2', 2),
                    't2-2',
                );
            });
        });

        describe('#pgettext', function () {
            it('should return singular from selected context', function () {
                assert.equal(gt.pgettext('c2', 'co2-1'), 'ct2-1');
            });
        });

        describe('#dpgettext', function () {
            it('should return singular from selected context', function () {
                assert.equal(gt.dpgettext('messages', 'c2', 'co2-1'), 'ct2-1');
            });
        });

        describe('#npgettext', function () {
            it('should return plural from selected context', function () {
                assert.equal(gt.npgettext('c2', 'co2-1', 'co2-2', 2), 'ct2-2');
            });
        });

        describe('#getComment', function () {
            it('should return comments object', function () {
                assert.deepEqual(gt.getComment('messages', '', 'test'), {
                    translator: 'Normal comment line 1\nNormal comment line 2',
                    extracted: 'Editors note line 1\nEditors note line 2',
                    reference: '/absolute/path:13\n/absolute/path:14',
                    flag: 'line 1\nline 2',
                    previous: 'line 3\nline 4',
                });
            });
        });
    });

    describe('Unresolvable transaltions', function () {
        beforeEach(function () {
            gt.addTranslations('et-EE', 'messages', jsonFile);
        });

        it('should pass msgid when no translation is found', function () {
            assert.equal(gt.gettext('unknown phrase'), 'unknown phrase');
            assert.equal(
                gt.dnpgettext('unknown domain', null, 'hello'),
                'hello',
            );
            assert.equal(
                gt.dnpgettext('messages', 'unknown context', 'hello'),
                'hello',
            );

            // 'o2-1' is translated, but no locale has been set yet
            assert.equal(gt.dnpgettext('messages', '', 'o2-1'), 'o2-1');
        });

        it('should pass unresolved singular message when count is 1', function () {
            assert.equal(
                gt.dnpgettext(
                    'messages',
                    '',
                    '0 matches',
                    'multiple matches',
                    1,
                ),
                '0 matches',
            );
        });

        it('should pass unresolved plural message when count > 1', function () {
            assert.equal(
                gt.dnpgettext(
                    'messages',
                    '',
                    '0 matches',
                    'multiple matches',
                    100,
                ),
                'multiple matches',
            );
        });
    });

    describe('Events', function () {
        var errorListener;

        beforeEach(function () {
            errorListener = sinon.spy();
            gt.on('error', errorListener);
        });

        it('should notify a registered listener of error events', function () {
            gt.emit('error', 'Something went wrong');
            assert.equal(errorListener.callCount, 1);
        });

        it('should deregister a previously registered event listener', function () {
            gt.off('error', errorListener);
            gt.emit('error', 'Something went wrong');
            assert.equal(errorListener.callCount, 0);
        });

        it('should emit an error event when a locale that has no translations is set', function () {
            gt.setLocale('et-EE');
            assert.equal(errorListener.callCount, 1);
        });

        it('should emit an error event when no locale has been set', function () {
            gt.addTranslations('et-EE', 'messages', jsonFile);
            gt.gettext('o2-1');
            assert.equal(errorListener.callCount, 1);
            gt.setLocale('et-EE');
            gt.gettext('o2-1');
            assert.equal(errorListener.callCount, 1);
        });

        it('should emit an error event when a translation is missing', function () {
            gt.addTranslations('et-EE', 'messages', jsonFile);
            gt.setLocale('et-EE');
            gt.gettext('This message is not translated');
            assert.equal(errorListener.callCount, 1);
        });

        it('should not emit any error events when a translation is found', function () {
            gt.addTranslations('et-EE', 'messages', jsonFile);
            gt.setLocale('et-EE');
            gt.gettext('o2-1');
            assert.equal(errorListener.callCount, 0);
        });

        it('should not emit any error events when the current locale is the default locale', function () {
            var gtd = new Gettext({ sourceLocale: 'en-US' });
            var errorListenersourceLocale = sinon.spy();
            gtd.on('error', errorListenersourceLocale);
            gtd.setLocale('en-US');
            gtd.gettext('This message is not translated');
            assert.equal(errorListenersourceLocale.callCount, 0);
        });
    });

    describe('Aliases', function () {
        it('should forward textdomain(domain) to setTextDomain(domain)', function () {
            sinon.stub(gt, 'setTextDomain');
            gt.textdomain('messages');
            assert.ok(gt.setTextDomain.calledWith('messages'));
            gt.setTextDomain.restore();
        });

        it('should forward setlocale(locale) to setLocale(locale)', function () {
            sinon.stub(gt, 'setLocale');
            gt.setLocale('et-EE');
            assert.ok(gt.setLocale.calledWith('et-EE'));
            gt.setLocale.restore();
        });
    });
});
