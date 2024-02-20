<template>
  <div class="w-full h-[48px] bg-slate-800 flex items-center justify-between p-4">
    <div class="text-white font-bold">SPOT THE BALL - ADMIN</div>

    <div class="flex items-center gap-4">
      <MetaMaskConnectButton />
      <button
        class="bg-slate-900 text-white rounded-lg py-2 px-6 text-[14px] h-[44px]"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import MetaMaskConnectButton from './MetaMaskConnectButton.vue'

export default {
  name: 'AdminHeader',
  components: {
    MetaMaskConnectButton
  },
  setup() {
    const handleLogout = () => {
      localStorage.removeItem('isAdmin')
      window.location.reload()
    }

    return {
      handleLogout
    }
  },
  created() {
    if (!localStorage.getItem('isAdmin')) {
      this.$router.push('/auth')
    }
  },
  watch: {
    $route(to) {
      if (!localStorage.getItem('isAdmin')) {
        this.$router.push('/auth')
      }
    }
  }
}
</script>