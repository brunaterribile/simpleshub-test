<template>
    <div class="home">
        <div class="button-container">
            <button 
                class="nav-button" 
                :class="{ active: currentView === 'send-pdf' }"
                @click="currentView = 'send-pdf'"
            >
                <img src="/upload.png" alt="Upload" class="button-icon">
                Enviar PDF
            </button>
            <button 
                class="nav-button"
                :class="{ active: currentView === 'history' }"
                @click="currentView = 'history'"
            >
                <img src="/history.png" alt="History" class="button-icon">
                Histórico
            </button>
        </div>
        
        <component :is="currentView"></component>
    </div>
</template>

<script>
import SendPDF from './SendPDF.vue'
import HistoryView from './History.vue'

export default {
    name: 'HomeView',
    components: {
        SendPDF,
        HistoryView
    },
    data() {
        return {
            currentView: 'send-pdf'
        }
    }
}
</script>

<style lang="scss">
.home {
    margin-top: 70px;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    width: 300px;
    border: none;
    border-radius: 0.375rem;
    background-color: #fff;
    color: #64748b;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    font-size: 1rem;
    line-height: 1.25rem;

    .button-icon {
        width: 20px;
        height: 20px;
        filter: invert(45%) sepia(8%) saturate(427%) hue-rotate(182deg) brightness(94%) contrast(87%);
    }

    &:hover {
        background-color: #f1f5f9;
    }

    &.active {
        background-color: #41cca3;
        color: white;
        
        .button-icon {
            filter: brightness(0) invert(1);
        }
    }
}
</style> 