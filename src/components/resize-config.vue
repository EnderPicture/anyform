<style scoped lang="scss">
@import "src/styles/_utilities";
.resize {
    @include mid-width;
}
</style>
<template>
    <div class="resize">
        <input type="checkbox" v-model="use" />
        <label>
            width
            <input
                name="width"
                v-model="width"
                type="number"
                placeholder="width"
            />
        </label>
        <label>
            height
            <input
                name="height"
                v-model="height"
                type="number"
                placeholder="height"
            />
        </label>
        <p>{{ desc }}</p>
    </div>
</template>

<script>
import { FILE_STATUS } from "@/js/constants";
export default {
    name: "resizeConfig",
    data() {
        return {
            use: false,

            width: null,
            height: null,
        };
    },
    computed: {
        desc() {
            let width = this.width ?? 1;
            let height = this.height ?? 1;
            return `image will have a the size of ${width} x ${height}px`;
        },
    },
};
</script>
