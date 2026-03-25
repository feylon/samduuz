<template>
    <div class="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">

        <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-100">

            <div class="flex flex-col items-center mb-8">
                <div class="p-4 rounded-full mb-4">
                    <img src="/pics/logo.png" class="w-24 h-24 object-contain" alt="SamDU Logo">
                </div>
                <h1 class="text-center font-bold text-gray-800 text-xl leading-tight">
                    Sharof Rashidov nomidagi <br>
                    <span>Samarqand davlat universiteti</span>
                </h1>
                <p class="text-gray-500 text-sm mt-2">Tizimga kirish uchun ma'lumotlarni kiriting</p>
            </div>

            <form @submit.prevent="SubmitFunction" class="space-y-5">

                <UFormField label="Login" name="login">
                    <UInput v-model="login" icon="i-heroicons-user" placeholder="Loginingizni kiriting" size="lg"
                        class="w-full" color="secondary" />
                </UFormField>

                <UFormField label="Parol" name="password">
                    <UInput v-model="password" icon="i-heroicons-lock-closed" type="password" placeholder="••••••••"
                        size="lg" class="w-full" color="secondary" :required="true" />
                </UFormField>

                <UButton type="submit" block size="lg" color="secondary" label="Kirish" :required="true"
                    class="mt-6 font-semibold transition-all active:scale-95" />

                <div class="text-center mt-4">
                    <NuxtLink  to="/" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      Bosh sahifaga qaytish
                    </NuxtLink>
                </div>
            </form>

        </div>
    </div>
</template>
<script lang="ts" setup>
import type { Res } from "../../../types/globalTypes"



const config = useRuntimeConfig();
const api = config.public.api

const login = ref<string>('');
const password = ref<string>('');
const toast = useToast();
const accessToken = useCookie('accessToken', {
    maxAge: 3600,
    sameSite: "lax"
});

const refreshToken = useCookie('refreshToken', {
    maxAge: 3600,
    sameSite: "lax"
});


const SubmitFunction = async () => {
    const RequestBody = {
        username: login.value,
        password: password.value
    };
    login.value = '';
    password.value = '';

   try {
    const data = await $fetch<Res<{
        accessToken: string,
        refreshToken: string
    }>>(`auth/login`, {
        method: "POST",
        baseURL: api,
        body: RequestBody,

        // 1. Serverdan xato javob kelsa (401, 404, 500 va h.k.)
        onResponseError({ response }) {
            if (response.status === 401) {
                toast.add({
                    title: "Login yoki parol xato",
                    duration: 6000,
                    color: "error"
                })
            }
        },

        onRequestError({ error }) {
            toast.add({
                title: "Serverga ulanib bo'lmadi",
                description: "Internetni tekshiring yoki server vaqtincha ishlamayapti.",
                duration: 6000,
                color: "error"
            })
        }
    });

    refreshToken.value = data.data.refreshToken;
    accessToken.value = data.data.accessToken;
    navigateTo("/admin/stat")

} catch (err: any) {
    if (err.message.includes('fetch failed') || err.code === 'ERR_CONNECTION_REFUSED') {
        console.error("Ulanish rad etildi!");
    }
}

}

</script>