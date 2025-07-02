const AccountManagement = {
    UpdateAccount: 'Update Account',
    DeleteProfile: 'Delete Profile',
    ViewAccount: 'View'
};

const StockManagement = {
    ViewStock: 'View Stock',
    AddStock: 'Add Stock',
    DeleteStock: 'Delete Stock',
    UpdateStock: 'Update Stock',
};

const SalesManagement = {
    ProcessSales: 'Process Sales',
    ViewSales: 'View Sales',
    AddCheckout: 'Add Checkout'
};

const UserManagement = {
    ViewUser: 'View User',
    AddUser: 'Add User',
    DeleteUser: 'Delete User',
    AssignRole: 'Assign Role',
};

const ClientManagement = {
    ViewClient: 'View Client',
    AddClient: 'Add Client',
    DeleteClient: 'Delete Client'
};

const ReportManagement = {
    GeneratePropertyReport: 'Generate Property Report',
    GenerateUserReport: 'Generate User Report',
    GenerateTransactionReport: 'Generate Transaction Report',
    AccessAnalytics: 'Access Analytics'
};

const PermissionManagement = {
    ManagePermission: 'Manage Permission',
    GenerateRole: 'Generate Role'
};

const StoreManagement = {
    UpdateStore: 'Update Store',
    CreateBranch: 'Create Branch',
    UpdateBranch: 'Update Branch',
    ViewBranch: 'View Branch',
    ViewStore: 'View Store',
};

const TransactionManagement = {
    ViewTransaction: 'View Transaction',
    AddTransaction: 'Add Transaction',
    DeleteTransaction: 'Delete Transaction'
};

const ShopkeeperManagement = {
    ManageStores: 'Manage Stores',
    ManageTransactions: 'Manage Transactions',
    ManageUsers: 'Manage Users',
};

const User = {
    ...AccountManagement,
};

const Cashier = {
    ...AccountManagement,
    ...SalesManagement,
    ...{ViewStock: StockManagement.ViewStock}
};


const SuperAdmin = {
    ...AccountManagement,
    ...StockManagement,
    ...SalesManagement,
    ...UserManagement,
    ...ClientManagement,
    ...PermissionManagement,
    ...ReportManagement,
    ...TransactionManagement,
    ...StoreManagement
};

const ShopkeeperAdmin = {
    ...AccountManagement,
    ...StockManagement,
    ...SalesManagement,
    ...UserManagement,
    ...ClientManagement,
    ...PermissionManagement,
    ...ReportManagement,
    ...TransactionManagement,
    ...StoreManagement,
    ...ShopkeeperManagement
};

const SalesAdmin = {
    ...SalesManagement,
    ...StockManagement,
    ...StoreManagement,
    ...ReportManagement,
    ...PermissionManagement,
    ...UserManagement,
    ...SalesManagement
};

const Permissions = {
    User,
    Cashier,
    SuperAdmin,
    SalesAdmin,
    ShopkeeperAdmin
};

export {Permissions};