<template>
     <div class="header">
        <div class="header-wrap">
            <div class="d-flex align-center pl-2">
                <div>
                    <v-img src="@/assets/media/logo.png" width="45" height="45"></v-img>
                </div>
                <span class="text-h5 ml-2">Smart Testing</span>
            </div>

            <div style="width: 100%;display: grid; grid-template-columns: 1.2fr 0.8fr; gap:50">
                <div class="d-flex align-center" style="gap: 50px">
                    <div class="d-flex align-center">
                        <v-icon size="18" color="#dcdcdcd0">mdi-help-circle-outline</v-icon>
                        <span class="ml-1"><span style="color: #dcdcdcd0">Questions:</span> 12/30</span>
                    </div>

                    <div class="d-flex align-center" style="gap: 20px">
                        <div class="d-flex align-center">
                            <v-icon size="18" color="#dcdcdcd0">mdi-clock-time-eight-outline</v-icon>
                            <span class="ml-1"><span style="color: #dcdcdcd0">Time:</span> 12:30</span>
                        </div>
                        
                        <div class="main-line">
                            <div class="second-line" style="width: 50px;"></div>
                        </div>
                    </div>
                </div>

                <div class="d-flex align-center">
                    <v-icon size="19" color="#dcdcdcd0">mdi-alpha-s-box-outline</v-icon>
                    <span class="ml-1"><span style="color: #dcdcdcd0">Subject:</span> Some subject</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods:{
        // Форматирует таймер
        formatTime(time) {
            const minutes = Math.floor(time / 60)
            let seconds = time % 60

            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return `${minutes}:${seconds}`
        }
    },
}
</script>


<style scoped>
.header{
    top: 0;
    position: fixed;
    width: 100%;
    height: 70px;
    background-color: var(--main-color);
    color: #fff
}
.header-wrap{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 250px auto;
}

.main-line{
    width: 400px;
    height: 3px;
    background-color: #88888884;
    position: relative;
}
.second-line{
    height: 3px;
    background-color: #fff;
    position: absolute;
}
</style>
