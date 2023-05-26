<template>
    <div class="content">
        <div class="content__main">
            <div class="question d-flex align-center" style="gap: 15px">
                <v-icon color="var(--main-color)">mdi-help-circle-outline</v-icon>
                <div class="ctx">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta numquam quos maxime necessitatibus iure neque, provident quod nesciunt itaque, atque ducimus eius doloribus fuga similique optio architecto aliquam sequi error.</div>
            </div>

            <div class="question-img d-flex justify-center" v-if="true">
                <div class="qwi" style="width: 55%;" v-if="true">
                    <v-img src="https://wallpaper.dog/large/20459078.jpg"></v-img>
                </div>
                <div class="qwf" style="width: 80%;" v-if="false">
                    <v-img src="https://wallpaper.dog/large/20459078.jpg"></v-img>
                </div>
            </div>

            <v-divider color="#888" style="opacity: 0.5;" v-if="true"></v-divider>

            <!-- Одиночные ответы -->
            <v-radio-group density="compact" color="var(--main-color)" v-if="false">
            <div class="answers">
                <div class="answer d-flex flex-column" v-for="(answer, i) in [1,2,3,4]" :key="i">
                    <div class="d-flex align-center" style="gap:20px">
                        <div class="ml-3">
                            <v-radio :value="answer"></v-radio>
                        </div>
                        <div class="ctx">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae id accusamus suscipit eius natus ex obcaecati est eveniet numquam, voluptate, harum nulla dolorum voluptas deleniti, dignissimos animi quod? Consequuntur, molestiae.</div>
                    </div>
                    <div class="d-flex justify-center" v-if="true">
                        <div style="width: 120px;" class="mt-2">
                            <v-img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png"></v-img>
                        </div>
                    </div>
                </div>
            </div>
            </v-radio-group>

            <!-- Мульти ответы -->
            <div class="answers" v-if="true">
                <div class="answer d-flex flex-column" v-for="(answer, i) in [1,2,3,4,5,6]" :key="i">
                    <div class="d-flex align-center" style="gap:20px">
                        <div class="ml-3">
                            <v-checkbox
                            density="compact"
                            color="var(--main-color)"
                            v-model="answers"
                            :value="answer"
                            ></v-checkbox>
                        </div>
                        <div class="ctx">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae id accusamus suscipit eius natus ex obcaecati est eveniet numquam, voluptate, harum nulla dolorum voluptas deleniti, dignissimos animi quod? Consequuntur, molestiae.</div>
                    </div>
                    <div class="d-flex justify-center">
                        <div style="width: 120px;" class="mt-2">
                            <v-img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png"></v-img>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content__footer">
            <div></div>
            <div class="d-flex justify-space-between">
                <div>
                    <v-btn
                    variant="text"
                    icon
                    size="32"
                    >
                    <v-icon size="27">mdi-arrow-left-thin-circle-outline</v-icon>
                    </v-btn>
                </div>
                <div>
                    <v-btn
                    variant="text"
                    icon
                    size="32"
                    >
                    <v-icon size="27">mdi-arrow-right-thin-circle-outline</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            answers: []
        }
    },
    watch:{
        answers(){
            console.log(this.answers);
        }
    }
}
</script>


<style scoped>
.content{
    padding: 30px;
    overflow-y: auto;
    position: relative;
}
.content__main{
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.content__footer{
    position: fixed;
    width: 100%;
    bottom: 50px;
    left: 0;
    display: grid;
    grid-template-columns: 250px auto;
}

.ctx{
    width: 100%;
    border: 1px #888 solid;
    padding: 15px;
    border-radius: 5px;
}

.answers{
    display: grid;
    grid-template-columns: repeat(auto-fill, 47%);
    justify-content: space-between;
    gap: 30px;
    width: 100%;
}

.answer{
    border-left: 1px solid #88888886
}
</style>
