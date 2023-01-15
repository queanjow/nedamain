import Login from 'views/pages/auth/Login.js';
import PovertyStats from 'views/pages/tables/poverty_statistics/index';
import CrimeSolution from 'views/pages/tables/crime_solutions_efficiency/index';
import Geomap from 'views/pages/maps/Geomap.js';
import LandAreaPopulation from 'views/pages/tables/land_area_population/index';
import GrdpCapita from 'views/pages/tables/gdrp_product/index';
import GrdpIndustry from 'views/pages/tables/gdrp_industry/index';
import InternalRevenue from 'views/pages/tables/internel_revenue/index';
import IncomeStatement from 'views/pages/tables/statement_of_income/index';
import VisualPovertyStats from 'views/pages/data_visualization/poverty_statistics';
import VisualCrimeSolution from 'views/pages/data_visualization/crime_solution_efficiency';
import VisualLandArea from 'views/pages/data_visualization/land_area';
import VisualPerCapita from 'views/pages/data_visualization/per_capita_gross';
import VisualGrdpIndustry from 'views/pages/data_visualization/per_industry';
import VisualInternalRevenue from 'views/pages/data_visualization/internal_revenue';
import VisualIncomeStatement from 'views/pages/data_visualization/income_statement';
import ForeignTrade from 'views/pages/tables/foreign_trade';
import Employment from 'views/pages/tables/employment';
import Production from 'views/pages/tables/production'
import Tourism from 'views/pages/tables/tourism';
import VisualForeignTrade from 'views/pages/data_visualization/foreign_trade';
import VisualEmployment from 'views/pages/data_visualization/employment';
import VisualProduction from 'views/pages/data_visualization/production';
import VisualTourism from 'views/pages/data_visualization/tourism';
import UsersSetup from 'views/pages/user_management/users';
import CustomIndicatorDashboard from 'views/pages/custom_indicator';

const routes = [
    {
        path: '/geographical-data',
        name: 'Geographical Data',
        icon: 'ni ni-pin-3 text-orange',
        miniName: 'GIS',
        component: Geomap,
        layout: '/admin'
    },
    {
        collapse: true,
        name: 'Data Visualization',
        icon: 'ni ni-chart-pie-35 text-info',
        state: 'dashboardsCollapse',
        views: [
            {
                path: '/visual-poverty-statistics',
                name: 'Poverty Statistics',
                miniName: 'PS',
                component: VisualPovertyStats,
                layout: '/admin'
            },
            {
                path: '/visual-crime-solutions',
                name: 'Crime Solution Efficiency',
                miniName: 'CSE',
                component: VisualCrimeSolution,
                layout: '/admin'
            },
            {
                path: '/visual-landarea',
                name: 'Land Area Population',
                miniName: 'LATP',
                component: VisualLandArea,
                layout: '/admin'
            },
            {
                path: '/visual-gdrp-product',
                name: 'GRPD per Capita',
                miniName: 'CAP',
                component: VisualPerCapita,
                layout: '/admin'
            },
            {
                path: '/visual-grdp-industry',
                name: 'GRPD per Industry',
                miniName: 'IND',
                component: VisualGrdpIndustry,
                layout: '/admin'
            },
            {
                path: '/visual-internal-revenue',
                name: 'Internal Revenue',
                miniName: 'IRC',
                component: VisualInternalRevenue,
                layout: '/admin'
            },
            {
                path: '/visual-income-statement',
                name: 'Statement of Income',
                miniName: 'SI',
                component: VisualIncomeStatement,
                layout: '/admin'
            },
            {
                path: '/visual-foreign-trade',
                name: 'Foreign Trade',
                miniName: 'FT',
                component: VisualForeignTrade,
                layout: '/admin'
            },
            {
                path: '/visual-employment',
                name: 'Employment',
                miniName: 'EMP',
                component: VisualEmployment,
                layout: '/admin'
            },
            {
                path: '/visual-production',
                name: 'Production',
                miniName: 'PRO',
                component: VisualProduction,
                layout: '/admin'
            },
            {
                path: '/visual-tourism',
                name: 'Tourism',
                miniName: 'TOUR',
                component: VisualTourism,
                layout: '/admin'
            }
        ]
    },
    {
        path: '/custom-indicator-dashboard',
        name: 'Custom Report',
        icon: 'ni ni-align-left-2 text-yellow',
        miniName: 'CID',
        component: CustomIndicatorDashboard,
        layout: '/admin'
    },
    {
        collapse: true,
        name: 'Reports',
        icon: 'ni ni-align-left-2 text-default',
        state: 'tablesCollapse',
        views: [
            {
                path: '/poverty-statistics',
                name: 'Poverty Statistics',
                miniName: 'PS',
                component: PovertyStats,
                layout: '/admin'
            },
            {
                path: '/crime-solution-efficiency',
                name: 'Crime Solution Efficiency',
                miniName: 'CSE',
                component: CrimeSolution,
                layout: '/admin'
            },
            {
                path: '/landarea',
                name: 'Land Area Population',
                miniName: 'LATP',
                component: LandAreaPopulation,
                layout: '/admin'
            },
            {
                path: '/gdrp-product',
                name: 'GRPD per Capita',
                miniName: 'CAP',
                component: GrdpCapita,
                layout: '/admin'
            },
            {
                path: '/gdrp-industry',
                name: 'GRPD per Industry',
                miniName: 'IND',
                component: GrdpIndustry,
                layout: '/admin'
            },
            {
                path: '/internal-revenue',
                name: 'Internal Revenue',
                miniName: 'IRC',
                component: InternalRevenue,
                layout: '/admin'
            },
            {
                path: '/income-statement',
                name: 'Income Statement',
                miniName: 'SI',
                component: IncomeStatement,
                layout: '/admin'
            },
            {
                path: '/foreign-trade',
                name: 'Foreign Trade',
                miniName: 'FT',
                component: ForeignTrade,
                layout: '/admin'
            },
            {
                path: '/employment',
                name: 'Employment',
                miniName: 'EMP',
                component: Employment,
                layout: '/admin'
            },
            {
                path: '/production',
                name: 'Production',
                miniName: 'PRO',
                component: Production,
                layout: '/admin'
            },
            {
                path: '/tourism',
                name: 'Tourism',
                miniName: 'TOUR',
                component: Tourism,
                layout: '/admin'
            }
        ]
    },
    {
        collapse: true,
        name: 'User Management',
        icon: 'ni ni-badge text-info',
        state: 'UserCollapse',
        views: [
            {
                path: '/users-management',
                name: 'Users',
                miniName: 'US',
                component: UsersSetup,
                layout: '/admin'
            }
        ]
    },
    {
        path: '/login',
        component: Login,
        layout: '/auth',
        return: null,
        disable: false
    }
];

export default routes;
