import * as VueRouter from "vue-router";
import Home from "@/page/Home";
import Collection from "@/page/Collection";
import Comminity from "@/page/Community";
import Foundation from "@/page/Foundation";
import Detail from "@/page/Detail";
import Market from '@/page/Market';
import User from '@/page/User';

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/collection", component: Collection, name: "collection" },
  { path: "/community", component: Comminity, name: "community" },
  { path: "/foundation", component: Foundation, name: "foundation" },
  { path: "/detail", component: Detail, name: "detail" },
  { path: "/market", component: Market, name: "market" },
  { path: "/user/:address", component: User, name: "user" },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
