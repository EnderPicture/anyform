<style scoped lang="scss">
@import "src/styles/_utilities";

.selector-con {
    @include mid-width;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 0;
}
.selector {
    input {
        display: none;
    }
    .select {
        padding: 0.5rem 1rem;
        background-color: lighten($alBlack, 10);
        border-radius: 0.5rem;
        margin: 0 0.25rem 0.5rem 0.25rem;
        opacity: 0.5;
        transition: all 0.2s ease;
    }
    input:checked ~ .select {
        padding: 0.5rem 2rem;
        opacity: 1;
    }
}
.desc {
    @include mid-width;

    margin-top: 0;
    margin-bottom: 1rem;
}
</style>
<template>
    <div class="selector-con">
        <label class="selector" v-for="format in formats" :key="format.name">
            <input
                name="format"
                :value="format"
                v-model="selectedFormat"
                type="radio"
            />
            <div class="select">
                {{ format.name }}
            </div>
        </label>
    </div>
    <p class="desc">
        converts all images to {{ selectedFormat.name }} with extension .{{
            selectedFormat.extension
        }}
    </p>
</template>

<script>
import { FILE_STATUS } from "@/js/constants";

export default {
    name: "formatSelector",
    data() {
        return {
            selectedFormat: null,
        };
    },
    computed: {
        formats() {
            return this.$store.state.formats;
        },
    },
    watch: {
        selectedFormat() {
            this.$store.commit("setFormat", this.selectedFormat);
        },
    },
    created() {
        this.selectedFormat = this.formats[0];
    },
};
</script>
