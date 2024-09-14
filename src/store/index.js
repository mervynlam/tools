import { defineStore } from 'pinia'
import { global } from './global'

export const useGlobalStore = defineStore('global', global)
