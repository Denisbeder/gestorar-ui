import AppLayout from '@/layouts/AppLayout.vue';

export default [
    {
        path: '/work-orders',
        name: 'WorkOrderIndex',
        component: () => import('../views/WorkOrder/WorkOrderIndexView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
    {
        path: '/work-orders/create',
        name: 'WorkOrderCreate',
        component: () => import('../views/WorkOrder/WorkOrderFormView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
    {
        path: '/work-orders/:id/edit',
        name: 'WorkOrderEdit',
        component: () => import('../views/WorkOrder/WorkOrderFormView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
];
