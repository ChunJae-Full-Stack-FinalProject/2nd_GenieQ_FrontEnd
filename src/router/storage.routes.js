import LikeMain from "@/components/storage/LikeMain.vue";
import WorkList1 from "@/components/storage/storageContent/MainCompo/WorkList1.vue";
import StorageMain from "@/components/storage/StorageMain.vue";
import WorkListMain from "@/components/storage/WorkListMain.vue";


const strageRoutes = [
    {
        path: 'storage',
        name: 'storage',
        children: [
            { path : '', name:'storage-main', component: StorageMain },
            { path : 'storageworklist', name:'storageworklist', component: WorkList1 },
            { path : 'worklistMina', name:'worklistMina', component: WorkListMain},
            { path : 'likelistMina', name:'likelistMina', component: LikeMain},
        ]
    }
]

export default strageRoutes;