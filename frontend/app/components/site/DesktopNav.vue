<script setup lang="ts">
import type { PublicMenu } from '~/types/api'

defineProps<{ items: PublicMenu[] }>()

const route = useRoute()
const localePath = useLocalePath()

const isActive = (menu: PublicMenu): boolean => {
  if (menu.link && !menu.isExternal && route.path === localePath(menu.link)) return true
  return menu.children.some(isActive)
}
</script>

<template>
  <nav
    aria-label="Main"
    class="hidden h-full items-stretch lg:flex"
  >
    <ul class="flex items-stretch gap-1">
      <li
        v-for="menu in items"
        :key="menu.id"
        class="group/top relative flex items-center"
      >
        <SiteMenuLink
          :link="menu.link"
          :is-external="menu.isExternal"
          class="relative flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors hover:bg-elevated hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
          :class="isActive(menu) ? 'text-primary' : 'text-default'"
          :tabindex="0"
        >
          {{ menu.name }}
          <UIcon
            v-if="menu.children.length"
            name="i-lucide-chevron-down"
            class="size-4 opacity-60 transition-transform duration-200 group-hover/top:rotate-180 group-focus-within/top:rotate-180"
          />
        </SiteMenuLink>

        <div
          v-if="menu.children.length"
          class="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover/top:visible group-hover/top:opacity-100 group-focus-within/top:visible group-focus-within/top:opacity-100"
        >
          <ul class="min-w-64 rounded-xl border border-default bg-default p-2 shadow-xl shadow-black/5">
            <li
              v-for="child in menu.children"
              :key="child.id"
              class="group/sub relative"
            >
              <SiteMenuLink
                :link="child.link"
                :is-external="child.isExternal"
                class="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm text-default transition-colors hover:bg-elevated hover:text-primary"
                :tabindex="0"
              >
                <span>{{ child.name }}</span>
                <UIcon
                  v-if="child.children.length"
                  name="i-lucide-chevron-right"
                  class="size-4 opacity-50"
                />
                <UIcon
                  v-else-if="child.isExternal"
                  name="i-lucide-arrow-up-right"
                  class="size-3.5 opacity-40"
                />
              </SiteMenuLink>

              <div
                v-if="child.children.length"
                class="invisible absolute left-full top-0 z-50 pl-2 opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:opacity-100 group-focus-within/sub:visible group-focus-within/sub:opacity-100"
              >
                <ul class="min-w-60 rounded-xl border border-default bg-default p-2 shadow-xl shadow-black/5">
                  <li
                    v-for="leaf in child.children"
                    :key="leaf.id"
                  >
                    <SiteMenuLink
                      :link="leaf.link"
                      :is-external="leaf.isExternal"
                      class="block rounded-lg px-3 py-2.5 text-sm text-default transition-colors hover:bg-elevated hover:text-primary"
                    >
                      {{ leaf.name }}
                    </SiteMenuLink>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
