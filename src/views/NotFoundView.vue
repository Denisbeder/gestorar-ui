<template>
  <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-2xl font-semibold text-primary">404</p>
      <h1 class="mt-4 text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Página não encontrada</h1>
      <p class="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">Desculpe, mas não conseguimos encontrar esta página.</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <button @click="$router.back()" class="btn btn--primary">Voltar</button>
        <!--<a href="#" class="btn btn&#45;&#45;link">Falar com o suporte <span aria-hidden="true">&rarr;</span></a>-->
      </div>
    </div>
  </main>
</template>
