<template>
    <div class="examination">

       <header-component />

        <div class="main">
            
            <sidebar-component />

            <div></div>
            <content-component />
        </div>

        <footer-component />

    </div>
</template>

<script>
import HeaderComponent from '@/components/exam/HeaderComponent.vue';
import FooterComponent from '@/components/exam/FooterComponent.vue';
import SidebarComponent from '@/components/exam/SidebarComponent.vue';
import ContentComponent from '@/components/exam/ContentComponent.vue';

export default {
    data(){
        return {
        }
    },
    components: {
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ContentComponent
    },
}
</script>


<style scoped>
::-webkit-scrollbar {
    width: 6px;
    display: block
}
.examination{
    width: 100%;
    position: relative;
    height: 100vh;
}

.main{
    width: 100%;
    position: relative;
    height: 100%;
    padding: 70px 0 40px;
    display: grid;
    grid-template-columns: 250px auto;
}
</style>