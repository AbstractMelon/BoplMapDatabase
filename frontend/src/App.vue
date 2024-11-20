<template>
    <div id="app">
        <div class="multi-use-container">
            <Header @toggle-upload-popup="showUploadPopup"/>
            <router-view style="width:calc(100% - 40px);max-width:1500px;margin-left:auto;margin-right:auto;padding:0px 20px 0px 20px;"/>
            <Footer />
            <UploadPopup
                :show="uploadPopupVisible"
                :close="closeUploadPopup"
                @upload-success="fetchMaps"
            />
        </div>
    </div>
</template>

<script>
import Header from './components/common/Header.vue';
import UploadPopup from './components/UploadPopup.vue';
import Footer from './components/common/Footer.vue';

export default {
    components: { Header, UploadPopup, Footer },
    data() {
        return {
            uploadPopupVisible: false,
        };
    },
    methods: {
        showUploadPopup() {
            console.log('Upload popup triggered');
            this.uploadPopupVisible = true;
        },
        closeUploadPopup() {
            this.uploadPopupVisible = false;
        },
    },
};
</script>

<style src="./styles.css"></style>
