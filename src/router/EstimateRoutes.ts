import AppLayout from '@/layouts/AppLayout.vue';

export default [
    {
        path: '/estimates',
        name: 'EstimateIndex',
        component: () => import('../views/Estimate/EstimateIndexView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
    {
        path: '/estimates/create',
        name: 'EstimateCreate',
        //component: () => import('../views/Estimate/EstimateFormView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
    {
        path: '/estimates/:id/edit',
        name: 'EstimateEdit',
        //component: () => import('../views/Estimate/EstimateFormView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
];
