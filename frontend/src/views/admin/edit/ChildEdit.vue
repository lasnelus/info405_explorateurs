<template>
    <div class="bg-primary/5 rounded-lg shadow-lg shadow-primary/15 p-8">
        <h1 class="text-3xl font-bold mb-4 text-primary">
            pizzza
            <!-- {{ child.firstName }} {{ child.lastName }} -->
          </h1>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getChild } from '@/services/familyServices';
import { role } from '@/services/authServices'

const route = useRoute()
const router = useRouter()


const childId = route.query.childID

const child = ref(null)

const roleUser = await role()

onMounted(async () =>{
    if (roleUser.data.role != 'OWNER' && roleUser.data.role != 'INSTRUCTOR') {
        router.push('/login')
    }else{
        const res = await getChild(childId)
        child.value = res.data
        console.log(child)
    }
})
</script>