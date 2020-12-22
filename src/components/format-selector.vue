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
    position: relative;
    margin: 0 0.25rem 0.5rem 0.25rem;
    input {
        position: absolute;
        z-index: -1;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        display: block;
        margin: 0;
        padding: 0;
        // visibility: hidden;
    }
    input:checked + .select {
        font-weight: 900;
        background-color: lighten($alBlack, 5);
        cursor: default;
        > p {
            transform: scale(1.2);
        }
    }
    input:focus + .select {
        transition: all 0.6s ease, box-shadow 0.1s ease;
        box-shadow: 0 0 0 2px $blue;
        &:hover {
            transition: 0.1s ease;
        }
    }
    .select {
        padding: 0.5rem 1rem;
        background-color: lighten($alBlack, 10);
        border-radius: 0.5rem;
        transition: 0.6s ease, padding 0.1s ease;
        &:hover {
            transition: 0.1s ease;
            transform: scale(1.1);
            opacity: 1;
            cursor: pointer;
        }
        > p {
            transition: 0.1s ease;
            margin: 0;
        }
    }
}
.desc {
    @include mid-width;
    text-align: center;
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
                <p>
                    {{ format.name }}
                </p>
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
        selectedFormat(value) {
            this.$store.commit("setFormat", value);
            this.$router.push({
                name: "Format",
                params: { format: value.name },
            });
        },
        $route(to) {
            if (to.params.format !== undefined) {
                this.formatByName(to.params.format);
            }
        },
    },
    methods: {
        formatByName(formatName) {
            let newFormat = this.$store.state.formats.find(
                (format) => format.name === formatName
            );
            if (newFormat !== undefined) {
                this.selectedFormat = newFormat;
            }
        },
    },
    created() {
        if (this.$route.params.format === undefined) {
            this.selectedFormat = this.formats[0];
        } else {
            this.formatByName(this.$route.params.format);
        }
    },
};
</script>
