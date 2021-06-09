<template>
  <v-app-bar app color="primary" dense>
    <div class="d-flex align-center">
      <v-img
        alt="Home Logo"
        class="shrink mr-2"
        contain
        src="@/assets/freqtrade-logo.png"
        transition="scale-transition"
        width="40"
        height="30px"
      />
    </div>
    <v-toolbar-title>Freqtrade UI</v-toolbar-title>
    <v-btn text small plain class="ml-2" to="/trade"> Trade </v-btn>
    <v-btn text small plain to="/dashboard"> Dashboard </v-btn>
    <BootswatchThemeSelect />
    <v-spacer></v-spacer>
    <div class="caption text--disabled mr-2">
      {{ botName }}
    </div>
    <div class="text--disabled">
      {{ isBotOnline ? 'Online' : 'Offline' }}
    </div>
    <v-menu v-if="loggedIn" offset-y>
      <template #activator="{ on, attrs }">
        <v-btn v-bind="attrs" text v-on="on">
          <v-avatar size="2em" color="grey darken-1">FT</v-avatar>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list light>
        <v-checkbox v-model="layoutLockedLocal" class="pl-5" label="Lock layout"></v-checkbox>
        <v-list-item @click="resetDynamicLayout">Reset Layout</v-list-item>
        <v-list-item to="/settings">Settings</v-list-item>
        <v-list-item to="/" @click.native="logout()">Sign Out</v-list-item>
      </v-list>
    </v-menu>
    <LoginModal v-else />
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import LoginModal from '@/views/LoginModal.vue';
import { State, Action, namespace } from 'vuex-class';
import userService from '@/shared/userService';
import BootswatchThemeSelect from '@/components/BootswatchThemeSelect.vue';
import { LayoutActions, LayoutGetters } from '@/store/modules/layout';
import { BotStoreGetters } from '@/store/modules/ftbot';

const ftbot = namespace('ftbot');
const layoutNs = namespace('layout');

@Component({
  components: { LoginModal, BootswatchThemeSelect },
})
export default class NavBar extends Vue {
  pingInterval: number | null = null;

  @State loggedIn!: boolean;

  @State isBotOnline!: boolean;

  @Action setLoggedIn;

  @ftbot.Action ping;

  @ftbot.Getter [BotStoreGetters.botName]: string;

  @layoutNs.Getter [LayoutGetters.getLayoutLocked]: boolean;

  @layoutNs.Action [LayoutActions.resetDashboardLayout];

  @layoutNs.Action [LayoutActions.resetTradingLayout];

  @layoutNs.Action [LayoutActions.setLayoutLocked];

  mounted() {
    this.ping();
    this.pingInterval = window.setInterval(this.ping, 60000);
  }

  beforeDestroy() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }

  logout(): void {
    userService.logout();
    this.setLoggedIn(false);
  }

  get layoutLockedLocal() {
    return this.getLayoutLocked;
  }

  set layoutLockedLocal(value: boolean) {
    console.log(value);
    this.setLayoutLocked(value);
  }

  resetDynamicLayout(): void {
    const route = this.$router.currentRoute.path;
    console.log(`resetLayout called for ${route}`);
    switch (route) {
      case '/trade':
        this.resetTradingLayout();
        break;
      case '/dashboard':
        this.resetDashboardLayout();
        break;
      default:
    }
  }

  @Watch(BotStoreGetters.botName)
  botnameChanged() {
    if (this.botName) {
      document.title = `freqUI - ${this.botName}`;
    } else {
      document.title = 'freqUI';
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  vertical-align: middle;
  height: 30px;
}

.dropdown-toggle::after {
  display: none;
}

.navbar-brand-title {
  padding-left: 0.5em;
}
.navbar {
  padding: 0.2rem 1rem;
}

.nav-link:active {
  color: white;
}

.verticalCenter {
  align-items: center;
  display: inline-flex;
  height: 100%;
}
</style>
