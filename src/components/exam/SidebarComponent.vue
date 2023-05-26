<template>
    <div class="sidebar">
        <div class="d-flex flex-column" style="gap: 30px">
            <div class="map">
                <div class="map__title">
                    <div class="d-flex align-center mb-1">
                        <v-icon size="18">mdi-format-list-bulleted</v-icon>
                        <span class="ml-1" style="font-size: 1.1em; font-weight: 300;">Questions</span>
                    </div>
                    <v-divider></v-divider>
                </div>
                <div class="map__table">
                    <v-table
                    density="compact"
                    >
                        <thead>
                        <tr>
                            <th style="width: 25px"></th>
                            <th class="text-left" style="width: 30px; color: #dcdcdcd0">#</th>
                            <th class="text-left" style="color: #dcdcdcd0; font-weight: 300;">Context</th>
                        </tr>
                        </thead>
                    </v-table>
                    <div class="table-body">
                    <v-table
                    density="compact"
                    >
                        <tbody>
                        <tr>
                            <td style="width: 25px; max-width: 25px;">
                                <v-icon size="18">mdi-text</v-icon>
                                <!-- <v-icon size="18">mdi-image-outline</v-icon>
                                <v-icon size="18">mdi-selection-ellipse-arrow-inside</v-icon> -->
                            </td>
                            <td style="width: 25px; max-width: 30px;">100</td>
                            <td style="max-width: 90px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis;">Common!</td>
                        </tr>
                        </tbody>
                    </v-table>
                    </div>
                </div>
            </div>

            <div class="btns d-flex flex-column" style="gap:15px;">
                <v-btn
                density="compact"
                width="100%"
                color="#444"
                >
                <v-icon size="15">mdi-pause-circle-outline</v-icon>
                <span class="ml-1" style="font-size: 0.9em;">Pause exam</span>
                </v-btn>
                <v-btn
                density="compact"
                width="100%"
                color="var(--main-color)"
                >
                <v-icon size="15">mdi-send</v-icon>
                <span class="ml-1" style="font-size: 0.9em;">Turn in work</span>
                </v-btn>
            </div>
        </div>

        <div class="info" style="margin-bottom: 90px;">
            <div class="d-flex align-center">
                <v-icon size="18" color="#dcdcdcd0">mdi-information-outline</v-icon>
                <span class="ml-1" style="color: #dcdcdcd0">Examiner:</span>
            </div>
            <div>
                <span>Rakhimov Diyor Nurullaevich</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
::-webkit-scrollbar {
    width: 6px;
    display: block;
    background-color: #b9b9b91b;
}

::-webkit-scrollbar-thumb {
    background-color: #d6d6d69a;
    border-radius: 1em;
}
.sidebar{
    position: fixed;
    height: 100%;
    width: 250px;
    background-color: var(--special-color);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 20px;
    gap: 50px;
}

.v-table{
    background: none;
    font-size: 0.9em;
}
.table-body{
    height: 50vh;
    max-height: 50vh;
    overflow-y: scroll;
    overflow-x: hidden;
}
#app > div > div > main > div > div.main > div.sidebar > div > div.map > div.map__table > div > div > table > thead{
    background-color: #ffffff0d
}
#app > div > div > main > div > div.main > div.sidebar > div  > div.map > div.map__table > div > div > table > thead > tr > th{
    padding: 0 7px;
}
#app > div > div > main > div > div.main > div.sidebar > div  > div.map > div.map__table > div.table-body > div > div > table > tbody > tr > td{
    padding: 0 7px;
    color: #fff;
    font-weight: 300;
    overflow: hidden;
    cursor: pointer;
}
#app > div > div > main > div > div.main > div.sidebar > div  > div.map > div.map__table > div.table-body > div > div > table > tbody > tr:hover{
    background-color: #ffffff0e;
}
</style>
