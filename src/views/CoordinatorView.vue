<template>
    <h1>Hi</h1>
    <!-- Проверка, есть ли у пользоват экзамен (если нет, кикнуть в auth) -->
    <!-- Если есть, принятие токена доступа к exam-server -->
    <!-- Натсройка параметров (язык сдачи) -->
    <!-- Показать экран ожидания -->
    <!-- Кинуть в Examination -->
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: mapGetters(['getUserData', 'getInitializationProcess']),
    mounted(){
        if(!this.getInitializationProcess){
            this.$router.push('/')
        }
        if(!this.getUserData){
            this.$router.push('/auth')
        }
    }
}
</script>
