<template>
    <div class="send-pdf">
        <div class="upload-container" :class="{ 'expanded': foundCpfs.length > 0 }">
            <h2>Enviar PDF</h2>
            
            <div class="file-input-container">
                <label class="file-label" v-if="!selectedFile">
                    <input 
                        type="file" 
                        accept="application/pdf"
                        @change="onFileChange" 
                        class="file-input"
                    />
                    <img src="../assets/upload.png" alt="Upload" class="upload-icon">
                    <span>Selecione um arquivo</span>
                </label>
                <div class="selected-file" v-else>
                    <img src="../assets/upload.png" alt="Upload" class="upload-icon">
                    <span class="file-name">{{ selectedFile.name }}</span>
                    <button class="remove-button" @click="removeFile">
                        <span class="x-icon">×</span>
                    </button>
                </div>
            </div>

            <div class="action-container">
                <button 
                    @click="submitPdf" 
                    :disabled="!selectedFile"
                    class="submit-button"
                    :class="{ 'disabled': !selectedFile }"
                >
                    Enviar
                </button>

                <p v-if="uploadStatus" 
                   class="status" 
                   :class="{
                       'error': uploadStatus.includes('corrompido') || 
                               uploadStatus.includes('erro') || 
                               uploadStatus.includes('Erro de conexão'),
                       'warning': uploadStatus.includes('Nenhum CPF'),
                       'success': uploadStatus.includes('sucesso')
                   }"
                >
                    {{ uploadStatus }}
                </p>
            </div>
            
            <div v-if="foundCpfs.length > 0" class="cpfs-found">
                <div class="cpfs-table-container">
                    <table class="cpfs-table">
                        <thead>
                            <tr>
                                <th>CPFs encontrados:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(cpf, index) in foundCpfs" :key="index">
                                <td>{{ cpf }}</td>
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
    name: 'SendPdf',
    data() {
        return {
            selectedFile: null,
            uploadStatus: '',
            foundCpfs: []
        };
    },
    methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.selectedFile = file;
                this.uploadStatus = '';
                this.foundCpfs = []; 
            } else {
                this.uploadStatus = 'Por favor, selecione um arquivo PDF válido.';
                this.selectedFile = null;
                this.foundCpfs = [];
            }
        },
        removeFile() {
            this.selectedFile = null;
            this.uploadStatus = '';
            this.foundCpfs = [];
            
            const fileInput = document.querySelector('.file-input');
            if (fileInput) {
                fileInput.value = '';
            }
        },
        async submitPdf() {
            if (!this.selectedFile) return;

            const reader = new FileReader();

            reader.onload = async () => {
                const arrayBuffer = reader.result;

            try {
                this.uploadStatus = 'Enviando...';
                this.foundCpfs = [];

                const response = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/pdf'
                        },
                    body: arrayBuffer
                });

                const data = await response.json();
                console.log('Resposta do servidor:', data);

                if (response.ok && data.success) {
                    this.uploadStatus = data.message || 'PDF enviado com sucesso!';
                    this.foundCpfs = data.cpfs || [];
                    console.log('CPFs coletados:', this.foundCpfs);
                } else {
                    this.uploadStatus = data.error || 'Erro ao enviar o PDF, tente novamente';
                }
            } catch (error) {
                console.error('Erro:', error);
                this.uploadStatus = 'Erro de conexão com o servidor';
            }

            };

            reader.readAsArrayBuffer(this.selectedFile);
        }
    }
}
</script>

<style lang="scss">
.send-pdf {
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    overflow: hidden;
}

.upload-container {
    background-color: #f8fafc;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    width: 100%;
    max-width: 800px;
    height: auto;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    overflow: visible;

    &.expanded {
        max-height: 100%;
    }

    h2 {
        margin-bottom: 2rem;
        color: #1e293b;
    }
}

.file-input-container {
    margin-bottom: 1.5rem;
}

.file-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
    z-index: -1;
}

.file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    border: 2px dashed #e2e8f0;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
    position: relative;

    &:hover {
        border-color: #41cca3;
        color: #41cca3;
    }

    .upload-icon {
        width: 24px;
        height: 24px;
        filter: invert(45%) sepia(8%) saturate(427%) hue-rotate(182deg) brightness(94%) contrast(87%);
    }

    &:hover .upload-icon {
        filter: invert(67%) sepia(40%) saturate(427%) hue-rotate(118deg) brightness(87%) contrast(87%);
    }
}

.selected-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: #f8fafc;
    
    .upload-icon {
        width: 24px;
        height: 24px;
        filter: invert(45%) sepia(8%) saturate(427%) hue-rotate(182deg) brightness(94%) contrast(87%);
    }
    
    .file-name {
        flex: 1;
        margin: 0 1rem;
        color: #1e293b;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .remove-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
        
        &:hover {
            background-color: #f1f5f9;
        }
        
        .x-icon {
            font-size: 1.5rem;
            font-weight: bold;
            color: #64748b;
            line-height: 1;
        }
    }
}

.submit-button {
    padding: 0.75rem 2rem;
    background-color: #41cca3;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    width: 200px;

    &:hover:not(.disabled) {
        background-color: #3bb890;
    }

    &.disabled {
        background-color: #e2e8f0;
        cursor: not-allowed;
    }
}

.action-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.status {
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    flex: 1;

    &.success {
        background-color: #f0fdf4;
        color: #166534;
        border: 1px solid #dcfce7;
    }

    &.error {
        background-color: #fef2f2;
        color: #991b1b;
        border: 1px solid #fee2e2;
    }

    &.warning {
        background-color: #fefce8;
        color: #854d0e;
        border: 1px solid #fef9c3;
    }
}

.cpfs-found {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    padding: 0;
    background-color: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;

}

.cpfs-header {
    padding: 1rem;
    color: #1e293b;
    font-size: 1rem;
    font-weight: 600;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.cpfs-table-container {
    flex: 1;
    overflow: auto;
    max-height: 200px;
    margin-top: 0;
    border-radius: 0 0 0.5rem 0.5rem;
}

.cpfs-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    
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
    
    td {
        color: #475569;
        background-color: #f8fafc;
    }

    tr:last-child td {
        border-bottom: none;
    }
}
</style>