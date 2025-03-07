<template>
    <div class="edit-passage-question">
        <EditPassage/>
        <EditQuestion @edit-mode-changed="forwardEditModeChange"/>
    </div>
</template>
<script>
import EditPassage from './EditPassage.vue';
import EditQuestion from './EditQuestion.vue';

export default {
    name: 'EditPassageQuestion',
    components: {
        EditPassage,
        EditQuestion
    },
    methods: {
        forwardEditModeChange(value) {
            // EditQuestion에서 전달받은 이벤트를 부모 컴포넌트로 전달
            this.$emit('edit-mode-changed', value);
        }
    }
}
</script>
<style scoped>
.edit-passage-question {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;

    position: absolute;
    width: 928px;
    height: 1120px;
    left: 292px;
    top: 176px;
}
</style>