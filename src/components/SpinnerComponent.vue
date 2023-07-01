<template>
    <div style="position: relative;">
        <div style="position: absolute; top:30px; left: 30px">
            <v-img
            src="@/assets/media/logo.png"
            width="90px"
            >
            </v-img>
        </div>

        <v-progress-circular
        :size="150"
        :width="3"
        color="var(--main-color)"
        indeterminate
        ></v-progress-circular>
    </div>
</template>
