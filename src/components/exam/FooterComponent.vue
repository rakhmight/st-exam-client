<template>
    <div class="footer">
        <div class="footer-wrap">
            <div></div>

            <div style="width: 100%;display: grid; grid-template-columns: 1.2fr 0.8fr; gap:50">
                <div class="d-flex align-center" style="gap: 50px">
                    <div class="d-flex align-center">
                        <v-icon size="18" color="#dcdcdcd0">mdi-ticket-outline</v-icon>
                        <span class="ml-1"><span style="color: #dcdcdcd0">Ticket:</span> 12</span>
                    </div>
                    <div class="d-flex align-center">
                        <v-icon size="19" color="#dcdcdcd0">mdi-alpha-t-box-outline</v-icon>
                        <span class="ml-1"><span style="color: #dcdcdcd0">Theme:</span> Some theme</span>
                    </div>
                </div>

                <div class="d-flex align-center" style="gap:20px">
                    <div class="d-flex align-center">
                        <v-icon size="18" color="#dcdcdcd0">mdi-clock-time-eight-outline</v-icon>
                        <span class="ml-1"><span style="color: #dcdcdcd0">Question time:</span> 0:40</span>
                    </div>
                    <div>
                        <div class="main-line">
                            <div class="second-line" style="width: 50px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer{
    bottom: 0;
    position: fixed;
    width: 100%;
    height: 40px;
    background-color: #2d2d2d;
    color: #fff
}
.footer-wrap{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 250px auto; 
}

.main-line{
    width: 250px;
    height: 3px;
    background-color: #a9a9a9;
    position: relative;
}
.second-line{
    height: 3px;
    background-color: var(--main-color);
    position: absolute;
}
</style>
