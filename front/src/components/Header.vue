<template>
    <div class="app-header">
        <img src="../assets/logo-white.png" class="object-contain" alt="SimplesHub Logo" style="width:150px;height:37px;">
    </div>
</template>

<script>
export default {
    name: 'AppHeader'
}
</script>

<style lang="scss">
    .app-header {
        background-color: #1e293b;
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 50px;
        padding: 0.7rem 2rem;
        border-bottom: 2px solid #41cca3;
        z-index: 20;
    }
</style>

// background-color: #233548;