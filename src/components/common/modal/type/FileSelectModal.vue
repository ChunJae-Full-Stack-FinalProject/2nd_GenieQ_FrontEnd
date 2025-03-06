<template>
    <BaseModal :isOpen="isOpen" width="435px" height="332px" @close="closeModal">
        <div class="modal-content-group">
            <div class="modal-title">추출할 파일 형식을 선택하세요</div>

            <div class="file-options">
                <div
                    v-for="file in fileTypes"
                    :key="file.type"
                    :class="['file-option', { active: selectedFile === file.type }]"
                    @click="selectFile(file.type)"
                >   

                <Icon class="file-icon" :icon="file.icon" width="53.33px"
                height="66.67px"/>
                <div class="file-label">{{ file.label }}</div>
                </div>
            </div>
        </div>

        <div class="modal-buttons">
            <BaseButton text="취소하기" type="type3" width="183.5px" height="46px" @click="closeModal" />
            <BaseButton text="추출하기" type="type1" width="183.5px" height="46px" :disabled="!selectedFile" @click="confirmSelection" />
        </div>
    </BaseModal>
</template>

<script setup>
    import { ref, watch } from "vue";
    import BaseModal from "../BaseModal.vue";;
    import BaseButton from "../../button/BaseButton.vue";
    import { Icon } from "@iconify/vue";

    const props = defineProps({
        isOpen: Boolean
    });

    const emit = defineEmits(["close", "confirm"]);

    const fileTypes = [
    { type: "pdf", label: ".pdf 파일", icon: "bxs:file-pdf" },
    { type: "word", label: ".word 파일", icon: "mdi:file-word" },
    { type: "txt", label: ".txt 파일", icon: "bxs:file-txt" }
];

    // ✅ PDF를 기본 선택값으로 설정
    const selectedFile = ref("pdf");

    const selectFile = (fileType) => {
        selectedFile.value = fileType;
    };

    const closeModal = () => {
        emit("close");
    };

    // ✅ 모달이 열릴 때 기본값을 PDF로 설정
    watch(() => props.isOpen, (newVal) => {
        if (newVal) {
            selectedFile.value = "pdf";
        }
    });

    const confirmSelection = () => {
        emit("confirm", selectedFile.value);
        closeModal();
    };
</script>

<style scoped>
    .modal-content { 
        padding: 22px;
        border-radius: 12px;
        gap: 36px;
    }

    .modal-content-group {
        display: flex;
        flex-direction: column;
        width: 296px;
        height: 190px;
        gap: 24px;
    }

    /* 제목 */
    .modal-title {
        height: 46px;
        padding: 8px;
        gap: 8px;
        font-weight: 700;
        font-size: 20px;
        line-height: 30px;
        letter-spacing: -2%;
        text-align: center;
    }

    /* 파일 선택 영역 */
    .file-options {
        display: flex;
        justify-content: center;
        gap: 15px;
        width:296px;
        height: 120px;
        padding: 8px;
        gap: 20px;
    }

    .file-option {
        width: 80px;
        height: 104px;
        cursor: pointer;
    }

    .file-icon{
        width: 53.33px;
        height: 66.67px; 
        color: #BDBDBD;
        transform: scale(1.2);
    }
    
    .file-option.active .file-icon{
        color: #303030;
    }

    .file-label {
        width: 80px;
        height: 24px;
        font-size: 16px;
        font-weight: 300;
        line-height: 24px;
        letter-spacing: -2%;
        text-align: center;
        color: #424242;
    }

    .file-option.active .file-label  {
        font-weight: 600;
    }

    /* 버튼 영역 */
    .modal-buttons {
        width: 391px;
        height: 62px;
        gap: 24px;
        padding-top: 8px;
        padding-bottom: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
