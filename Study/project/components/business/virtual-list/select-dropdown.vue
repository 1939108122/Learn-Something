<template>
    <ul class="select-dropdown">
        <slot></slot>
        <slot name="empty"></slot>
  </ul>
</template>
<script>

export default {
    name: 'SelectDropdown'
};
</script>
<style lang='less' scoped>
</style>