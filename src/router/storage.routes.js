import WorkList1 from "@/components/storage/storageContent/MainCompo/WorkList1.vue";
import StorageMain from "@/components/storage/StorageMain.vue";


const strageRoutes = [
    {
        path: 'storage',
        name: 'storage',
        children: [
            { path : '', name:'storage-main', component: StorageMain },
            // { path : 'storageworklist', name:'storageworklist', component: WorkList1 },
        ]
    }
]

export default strageRoutes;