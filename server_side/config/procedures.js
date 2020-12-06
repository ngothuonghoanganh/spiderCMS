/*
 * to test on php myadmin:
 `DELIMITER //
  CREATE PROCEDURE loadAccountPermission
  (
      IN accountID int(11)
  )
  BEGIN
    SELECT
          permissions.*
      FROM
          permissions
      LEFT JOIN accountPermissions ON permissions.id = accountPermissions.permissionId
      WHERE
          accountPermissions.accountId=accountID;
  END //
  DELIMITER ;`
*/
module.exports = {
  loadAccountPermissionByAccountId: `CREATE PROCEDURE loadAccountPermissionByAccountId
                                    (
                                        IN account_id int(11)
                                    )
                                    BEGIN
                                      SELECT
                                            permissions.*
                                        FROM
                                            permissions
                                        LEFT JOIN accountPermissions ON permissions.id = accountPermissions.permissionId
                                        WHERE
                                            accountPermissions.accountId=account_id;
                                    END;`,
  loadAccountRolePermissionByAccountId: `CREATE PROCEDURE loadAccountRolePermissionByAccountId
                              (
                                  IN account_id int(11)
                              )
                              BEGIN
                                SELECT DISTINCT permissions.*
                                FROM permissions
                                LEFT JOIN rolePermissions ON permissions.id = rolePermissions.permissionId
                                LEFT JOIN accountRoles ON rolePermissions.roleId = accountRoles.roleId
                                WHERE rolePermissions.isActive = 1 AND accountRoles.accountId = account_id;
                              END;`,
  activeEmail: `CREATE PROCEDURE activeEmail
                (
                    IN tokenParam varchar(256)
                )
                BEGIN
                  DECLARE accountId int(11);
                  DECLARE profileId int(11);

                  SELECT activeMails.accountId INTO accountId
                  FROM activeMails
                  WHERE token = tokenParam;

                  SELECT accounts.profileId INTO profileId
                  FROM accounts
                  WHERE id = accountId;

                  UPDATE activeMails
                  SET isUsed = 1
                  WHERE token = tokenParam;

                  UPDATE accounts
                  SET isActive = 1
                  WHERE id = accountId;

                  UPDATE profiles
                  SET isActive = 1
                  WHERE id = profileId;
                END;`,
  loadPermissionWithRole: `CREATE PROCEDURE loadPermissionWithRole
                              (
                                  IN role_id int(11)
                              )
                              BEGIN
                                SELECT permissions.*, rolePermissions.isActive, rolePermissions.roleId FROM permissions
                                LEFT JOIN rolePermissions ON permissions.id = rolePermissions.permissionId
                                WHERE roleId = role_id;
                              END;`,
  loadProfilePositionChart: `CREATE PROCEDURE loadProfilePositionChart
                              (
                                  IN department_id int(11)
                              )
                              BEGIN
                                SELECT profiles.*, CONCAT(profiles.firstName, " ", profiles.lastName) AS 'name',
                                pp1.id as 'profilePositionId',
                                pp1.parentInChart,
                                positions.id as 'positionId', positions.name as 'positionName', positions.level, positions.key as 'positionKey',
                                COUNT(pp2.parentInChart) as 'childnumber',
                                IF(COUNT(pp2.parentInChart)>0, "yes", "no") as 'havechild'
                                FROM profiles
                                LEFT JOIN profilePositions pp1 ON profiles.id = pp1.profileId
                                LEFT JOIN positions ON pp1.positionId = positions.id
                                LEFT JOIN profilePositions pp2 ON pp1.id = pp2.parentInChart
                                WHERE positions.departmentId = department_id
                                AND profiles.isActive = 1
                                GROUP BY pp1.id;
                              END;`,
  getProfilePositionDetail: `CREATE PROCEDURE getProfilePositionDetail
                            (
                                IN profile_id int(11)
                            )
                            BEGIN
                                SELECT departments.id as 'departmentId', departments.name as 'departmentName', positions.name as 'positionName', profilePositions.positionId, profilePositions.id as 'profilePositionId'
                                FROM departments
                                LEFT JOIN positions ON departments.id = positions.departmentId
                                LEFT JOIN profilePositions ON positions.id = profilePositions.positionId
                                WHERE profilePositions.profileId = profile_id;
                            END;`,
  loadProfilePositionDetail: `CREATE PROCEDURE loadProfilePositionDetail
                            (
                                IN profilePosition_id int(11)
                            )
                            BEGIN
                                SELECT pp1.*, COUNT(pp2.parentInChart) as 'childnumber'
                                FROM profilePositions pp1 LEFT JOIN profilePositions pp2 ON pp1.id = pp2.parentInChart
                                WHERE pp1.id = profilePosition_id
                                GROUP BY pp1.id;
                            END;`,
  loadListBirthdayInMonth: `CREATE PROCEDURE loadListBirthdayInMonth
                            (
                                IN start_month int(11),
                                IN end_month int(11)
                            )
                            BEGIN
                                SELECT id
                                FROM profiles
                                WHERE UNIX_TIMESTAMP(birthday) >= start_month
                                AND UNIX_TIMESTAMP(birthday) < end_month
                                AND isActive = 1
                                AND haveAccount = 0;
                            END;`,
};
