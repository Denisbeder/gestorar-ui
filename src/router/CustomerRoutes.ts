import AppLayout from '@/layouts/AppLayout.vue';

export default [
    {
        path: '/customers',
        name: 'CustomersIndex',
        component: () => import('../views/Customer/CustomerIndexView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
    {
        path: '/customers/create',
        name: 'CustomersCreate',
        component: () => import('../views/Customer/CustomerFormView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
    {
        path: '/customers/:id/edit',
        name: 'CustomersEdit',
        component: () => import('../views/Customer/CustomerFormView.vue'),
        meta: { requiresAuth: true, layout: AppLayout },
    },
];
