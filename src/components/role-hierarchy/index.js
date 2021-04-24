import CreateHierarchy from "./components/hierarchy/CreateHierarchy";
import Organisation from "./components/hierarchy/Organisation";
import { FIELDS } from "./components/util/ChannelTypeFields";
import RoleHierarchyMain from "./components/hierarchy/RoleHierarchyMain";
import HierarchyTable from "./components/hierarchy/HierarchyTable";
import HierarchyTree from "./components/hierarchy/HierarchyTree";
import SummaryView from "./components/hierarchy/SummaryView";
import CreateForm from "./components/hierarchy/CreateForm";
import UserReassign from "./components/hierarchy/UserReassign";
/* export { ViewChannelPartner, CreateChannelPartners, Organisation , ModalTab, FIELDS, BUSINESS_LOCATION_GROUP};

export default ChannelPartners; */

module.exports = {
    Organisation,
    FIELDS,
    CreateHierarchy,
    RoleHierarchyMain,
    HierarchyTable,
    HierarchyTree,
    SummaryView,
    CreateForm,
    UserReassign

};