<script setup lang="ts">
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <img src="../assets/logoexplorateurV2.1.png" class="logo-img" />
      </div>
      <div class="auth-buttons">
        <button class="btn btn-login">Connexion</button>
        <button class="btn btn-signup">Inscription</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #333;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo-img {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-login:hover {
  background-color: white;
  color: #333;
}

.btn-signup {
  background-color: #4caf50;
  color: white;
}

.btn-signup:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .auth-buttons {
    width: 100%;
    gap: 0.5rem;
  }

  .btn {
    flex: 1;
  }
}
</style>
