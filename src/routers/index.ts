import { ROLES } from "@/constants/roles";

export const PRIVATE_ROUTES_CONFIG = [
  {
    path: "/app/minha-conta",
    roles: [ROLES.admin, ROLES.commonUser, ROLES.supplier],
    isPublic: false,
  },
  {
    path: "/app/pagamento",
    roles: [ROLES.commonUser],
    isPublic: false,
  },
  {
    path: "/app/aguardando-pagamento",
    roles: [ROLES.commonUser],
    isPublic: false,
  },
  { path: "/app/admin", roles: [ROLES.admin], isPublic: false },
  { path: "/app/dashboard", roles: [ROLES.supplier], isPublic: false },
  { path: "/app/dashboard/parceiro", roles: [ROLES.supplier], isPublic: false },
  {
    path: "/app/dashboard/parceiro/ativar-cupom",
    roles: [ROLES.supplier],
    isPublic: false,
  },
  {
    path: "/app/dashboard/parceiro/perfil",
    roles: [ROLES.supplier],
    isPublic: false,
  },
  { path: "/app/meus-cupons", roles: [ROLES.commonUser], isPublic: false },
];

export const AUTH_ROUTE_PATHS = [
  "/app/conta/acessar",
  "/app/conta/entrar",
  "/app/conta/cadastrar/parceiro",
  "/app/conta/cadastrar/usuario",
  "/app/conta/esqueci-a-senha",
  "/app/conta/criar-nova-senha",
];

export const ROLE_START_URL = {
  [ROLES.commonUser]: "/app/meus-cupons",
  [ROLES.admin]: "/app/admin",
  [ROLES.supplier]: "/app/dashboard",
};
