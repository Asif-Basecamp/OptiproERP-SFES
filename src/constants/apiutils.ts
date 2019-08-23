export class ApiUtils {
    
    //Login
    public static url_ValidateUserLogin: string = "/api/login/ValidateUserLogin";
    public static url_getWorkcenter: string = "/api/login/getWorkcenter";
    public static url_getConfigSetting: string = "/api/AdvanceSFDC/getConfigSetting";
    public static url_GetLicenseData: string = "/api/SFDCLogin/GetLicenseData";
    public static url_GetCompaniesAndLanguages: string = "/api/Login/GetCompaniesAndLanguages";
    public static url_GetPSURL: string = "/api/SFDCLogin/GetPSURL";
    public static url_GetWHS: string = "/api/Login/GetWHS";
    public static url_GetMachine: string = "/api/SFDCLogin/GetMachine";
    public static url_ValidateShiftTime: string = "/api/SFDCLogin/ValidateShiftTime";
    public static url_GetMenuRecord: string = "/api/SFDCLogin/GetMenuRecord";
    public static url_UserLoginLog: string = "/api/SFDCLogin/UserLoginLog";
    public static url_GetPermissionDetails: string = "/api/SFDCLogin/GetPermissionDetails";
    
    //Dashboard
    public static url_CreateDirectory: string = "/api/AdvanceSFDC/CreateDirectory";
    public static url_GetAllTask: string = "/api/AdvanceSFDC/GetAllTask";
    public static url_DeleteDirectory: string = "/api/AdvanceSFDC/DeleteDirectory";
    public static url_RemoveLoggedInUser: string = "/api/SFDCLogin/RemoveLoggedInUser";

    public static url_GetAutoLot: string = "/api/AdvanceSFDC/GetAutoLot";
    public static url_GetAllReasons: string = "/api/AdvanceSFDC/GetAllReasons";
    public static url_GetResourceDetail: string = "/api/AdvanceSFDC/GetResourceDetail";
    public static url_GetItemManagedBy: string = "/api/BatchSerialLinking/GetItemManagedBy";
    public static url_GetAttachmentColumnNames: string = "/api/AdvanceSFDC/GetAttachmentColumnNames";
    public static url_GetExistingTaskDetail: string = "/api/AdvanceSFDC/GetExistingTaskDetail";

    //Time-Entry
    public static url_SaveResourceDetail: string = "/api/AdvanceSFDC/SaveResourceDetail";
    public static url_SaveInteruptTaskDetail: string = "/api/AdvanceSFDC/SaveInteruptTaskDetail";
    public static url_AbortRecord: string = "/api/AdvanceSFDC/AbortRecord";
    public static url_GetAllSavedData: string = "/api/BatchSerialLinking/GetAllSavedData";
  };