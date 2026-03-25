<template>
  <div class="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-end gap-3 group">
    
    <button 
      class="w-14 h-14 bg-secondary-500 hover:bg-secondary-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:rotate-45"
    >
      <UIcon name="i-heroicons-plus" class="w-8 h-8" />
    </button>

    <div 
      class="flex flex-col items-end gap-3 transition-all duration-300 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
    >

      <NuxtLink to="/admin/Pages/DepartmentPage/create" class="flex items-center gap-3 group/item">
        <span class="bg-gray-800 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 translate-x-4 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0">
          Filial (Kafedra) qo'shish
        </span>
        <div class="w-12 h-12 bg-white text-secondary-500 hover:text-white hover:bg-secondary-500 border border-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300">
          <UIcon name="i-heroicons-building-office-2" class="w-5 h-5" />
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/Pages/EmployeePage/create" class="flex items-center gap-3 group/item">
        <span class="bg-gray-800 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 translate-x-4 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0">
          Xodim qo'shish
        </span>
        <div class="w-12 h-12 bg-white text-sky-600 hover:text-white hover:bg-sky-600 border border-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300">
          <UIcon name="i-heroicons-user-plus" class="w-5 h-5" />
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/Pages/simplePage/create" class="flex items-center gap-3 group/item">
        <span class="bg-gray-800 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 translate-x-4 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0">
          Oddiy sahifa qo'shish
        </span>
        <div class="w-12 h-12 bg-white text-secondary-500 hover:text-white hover:bg-secondary-500 border border-gray-100 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300">
          <UIcon name="i-heroicons-document-plus" class="w-5 h-5" />
        </div>
      </NuxtLink>

    </div>
  </div>
</template>
