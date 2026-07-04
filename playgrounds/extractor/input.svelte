<script>
const { _ } = gt.bindLocale("zh_TW")
_("hello")
// TRANSLATORS: This comment should be included
const message = _("world")
const message2 = _("worldd……")
// xgettext: no-ellipsis-unicode-check
const message3 = _("worldd......")
</script>

<div class={_(`I don't think this works`)}>{_("another message")}</div>
<div>{_(
  // TRANSLATORS: I expect this to be kept
  "foo"
)}</div>
