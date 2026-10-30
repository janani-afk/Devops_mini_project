
package com.medistock.dao;

import com.medistock.model.Activity;
import com.medistock.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ActivityDAO {

    // 1. Add a new activity
    public boolean addActivity(String medicineName,
                               String action,
                               String description) throws SQLException {

        String sql = "INSERT INTO activity " +
                "(medicine_name, action, description) " +
                "VALUES (?, ?, ?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, medicineName);
            ps.setString(2, action);
            ps.setString(3, description);

            return ps.executeUpdate() > 0;
        }
    }

    // 2. Get all activities
    public List<Activity> getAllActivities() throws SQLException {

        List<Activity> activities = new ArrayList<>();

        String sql = "SELECT * FROM activity ORDER BY id DESC";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {

                Activity activity = new Activity();

                activity.setId(rs.getInt("id"));
                activity.setMedicineName(
                        rs.getString("medicine_name"));

                activity.setAction(rs.getString("action"));

                activity.setDescription(
                        rs.getString("description"));

                Timestamp date = rs.getTimestamp("activity_date");

                if (date != null) {
                    activity.setActivityDate(date.toString());
                }

                activities.add(activity);
            }
        }

        return activities;
    }
}
