<template>
    <div class="send-pdf">
        <div class="upload-container">
            <h2>Enviar PDF</h2>
            
            <div class="file-input-container">
                <input 
                    type="file" 
                    accept="application/pdf" 
                    @change="onFileChange" 
                    class="file-input"
                    id="pdf-upload"
                />
                <label for="pdf-upload" class="file-label" v-if="!selectedFile">
                    <img src="/upload.png" alt="Upload" class="upload-icon">
                    <span>Selecione um arquivo</span>
                </label>
                <div class="selected-file" v-else>
                    <img src="/upload.png" alt="Upload" class="upload-icon">
                    <span class="file-name">{{ selectedFile.name }}</span>
                    <button class="remove-button" @click="removeFile">
                        <span class="x-icon">×</span>
                    </button>
                </div>
            </div>

            <button 
                @click="submitPdf" 
                :disabled="!selectedFile"
                class="submit-button"
                :class="{ 'disabled': !selectedFile }"
            >
                Enviar
            </button>

            <p v-if="uploadStatus" class="status" :class="{ 'error': uploadStatus.includes('erro') }">
                {{ uploadStatus }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SendPdf',
    data() {
        return {
            selectedFile: null,
            uploadStatus: ''
        };
    },
    methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.selectedFile = file;
                this.uploadStatus = '';
            } else {
                this.uploadStatus = 'Por favor, selecione um arquivo PDF válido.';
                this.selectedFile = null;
            }
        },
        removeFile() {
            this.selectedFile = null;
            this.uploadStatus = '';
            
            const fileInput = document.getElementById('pdf-upload');
            if (fileInput) {
                fileInput.value = '';
            }
        },
        async submitPdf() {
            if (!this.selectedFile) return;

            const formData = new FormData();
            formData.append('pdf', this.selectedFile);

            try {
                this.uploadStatus = 'Enviando...';

                const response = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    this.uploadStatus = 'PDF enviado com sucesso!';
                    console.log('CPFs extraídos:', data.cpfs);
                } else {
                    this.uploadStatus = 'Erro ao enviar o PDF, tente novamente';
                }
            } catch (error) {
                this.uploadStatus = 'Erro ao enviar o PDF, tente novamente';
                console.error('Erro:', error);
            }
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
    min-height: calc(100vh - 200px);
}

.upload-container {
    background-color: #f8fafc;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    width: 100%;
    max-width: 800px;

    h2 {
        margin-bottom: 2rem;
        color: #1e293b;
    }
}

.file-input-container {
    margin-bottom: 1.5rem;
}

.file-input {
    display: none;
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

.status {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 0.375rem;
    background-color: #f0fdf4;
    color: #166534;

    &.error {
        background-color: #fef2f2;
        color: #991b1b;
    }
}
</style>