<template>
    <div class="card-container">
        <div class="worklist-title">
            <p>최근 작업 내역</p>
            <Icon icon="weui:arrow-outlined" width="24" height="24" id="arrow-icon" style="color: #303030" />
        </div>
       <div class="worklist-table">
        <div class="table-container">
            <table class="data-table">
            <thead>
                <tr>
                <th>작업명</th>
                <th>제재</th>
                <th>유형</th>
                <th>최종 작업일</th>
                <th>추출하기</th>
                <th>즐겨찾기</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1123</td>
                    <td>2213</td>
                    <td>312</td>
                    <td>4213</td>
                    <td><button>123</button></td>
                    <td>별</td>
                </tr>
            </tbody>
            </table>
        </div>
       </div>
   </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
</script>
<style scoped>
.worklist-title {
   display: flex;
   align-items: flex-start;
   gap: 12px;
   isolation: isolate;
   position: absolute;
   width: 1472px;
   height: 506px;
   left: 292px;
   top: 350px;
   border-radius: 8px;
   box-sizing: border-box;
}
.worklist-table {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   /* padding: 15px; */
   gap: 12px;
   isolation: isolate;
   position: absolute;
   width: 1472px;
   height: 506px;
   left: 292px;
   top: 400px;
   background: #FFFFFF;
   border-radius: 8px;
   box-sizing: border-box;
}

.data-table thead th{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 36px;

    width: 1472px;
    height: 46px;
    border-bottom: 1px solid #E1E1E1;
}
/* 지문 */
.data-table tbody td {
    height: 46px;
    flex: none;
    order: 1;
    flex-grow: 0;
}

.data-table tbody tr {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 60px;
    /* width: 1472px; */
    width: 1400px;
    /* height: 46px; */
    background: #FFFFFF;
    border-bottom: 1px solid #E1E1E1;
}
.data-table thead tr {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 60px;

    width: 1472px;
    height: 46px;

    flex: none;
    order: 0;
    flex-grow: 0;
}

tr th:nth-child(1) {

    padding: 8px;
    gap: 8px;

    width: 380px;
    height: 46px;

    flex: none;
    order: 0;
    flex-grow: 0;
}


tr td:nth-child(1) {

    padding: 8px;
    gap: 8px;

    width: 380px;
    height: 46px;

    flex: none;
    order: 0;
    flex-grow: 0;
}


tr th:nth-child(2) {
    display: flex;

    padding: 8px;
    gap: 8px;

    width: 240px;
    height: 46px;


    flex: none;
    order: 1;
    flex-grow: 0;
}

tr td:nth-child(2) {
    display: flex;

    padding: 8px;
    gap: 8px;

    width: 240px;
    height: 46px;


    flex: none;
    order: 1;
    flex-grow: 0;
}


tr th:nth-child(3) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;


    flex: none;
    order: 2;
    flex-grow: 0;
}

tr td:nth-child(3) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;


    flex: none;
    order: 2;
    flex-grow: 0;
}

tr th:nth-child(4){

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;

    flex: none;
    order: 3;
    flex-grow: 0;

}

tr td:nth-child(4){

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;

    flex: none;
    order: 3;
    flex-grow: 0;

}

tr th:nth-child(5){
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;

    flex: none;
    order: 4;
    flex-grow: 0;
}

tr td:nth-child(5){
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;

    flex: none;
    order: 4;
    flex-grow: 0;
}

tr th:nth-child(6){
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;

    flex: none;
    order: 5;
    flex-grow: 0;
}

tr td:nth-child(6){
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 8px;

    width: 120px;
    height: 46px;

    flex: none;
    order: 5;
    flex-grow: 0;
}
</style>
