<template>
  <div class="image-palette">
    <div class="image-grid">
      <div v-for="(image, index) in images" :key="index" class="image-item">
        <img :src="image" :alt="`Image ${index}`" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImagePalette",
  data() {
    return {
      // This is where you would list your image filenames
      images: [
        "../src/assets/boat_image.png",
        "../src/assets/boat_image_2.png",
        "../src/assets/boat_image_3.png",
        "../src/assets/water_image.png",
        "../src/assets/water_image_2.png",
        "../src/assets/missed_shot.png",
        "../src/assets/missed_shot_2.png",
        "../src/assets/missed_shot_3.png",
      ],
    };
  },
};
</script>

<style scoped>
.image-palette {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding: 10px;
}

.image-item img {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
