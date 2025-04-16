<template>
    <div class="history">
        <div class="history-container">
            <h2>Histórico de CPFs</h2>
            <div class="content">
                <div v-if="loading" class="loading">
                    <p>Carregando ...</p>
                </div>
                <div v-else-if="cpfs.length === 0" class="empty-state">
                    <p>Nenhum CPF encontrado ainda</p>
                </div>
                <div v-else class="table-container">
                    <table class="cpf-table">
                        <thead>
                            <tr>
                                <th>CPF</th>
                                <th>Data de Criação</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(cpf, index) in cpfs" :key="index">
                                <td>{{ cpf.number }}</td>
                                <td>{{ formatDate(cpf.createdAt) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HistoryView',
    data() {
        return {
            cpfs: [],
            loading: true
        }
    },
    created() {
        this.fetchCpfs();
    },
    methods: {
        async fetchCpfs() {
            try {
                this.loading = true;
                const response = await fetch('http://localhost:3000/api/history');
                if (!response.ok) {
                    throw new Error('Erro ao buscar CPFs');
                }
                const data = await response.json();
                this.cpfs = data.cpfs || [];
            } catch (error) {
                console.error('Erro ao buscar CPFs:', error);
                this.cpfs = [];
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
}
</script>

<style lang="scss">
.history {
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    overflow: hidden;
}

.history-container {
    background-color: #f8fafc;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    width: 100%;
    max-width: 800px;
    height: calc(100% - 2rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    h2 {
        margin-bottom: 2rem;
        color: #1e293b;
    }
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.empty-state, .loading {
    text-align: center;
    color: #64748b;
    font-style: italic;
    padding: 2rem 0;
}

.table-container {
    flex: 1;
    overflow: auto;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
}

.cpf-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 0;
    border-radius: 0.5rem;
    
    th, td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }
    
    th {
        background-color: #41cca3;
        font-weight: 600;
        color: white;
        position: sticky;
        top: 0;
        z-index: 1;
    }
    
    tr:hover {
        background-color: #f8fafc;
    }
    
    td {
        color: #475569;
    }
}
</style> 