<template>
    <div class="hello">
        {{index}}{{file.name}}
    </div>
</template>

<script>
export default {
    name: "fileCell",
    props: {
        file: Object,
        index: Number,
    },
};
</script>