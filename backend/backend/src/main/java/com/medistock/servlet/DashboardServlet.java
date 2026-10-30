package com.medistock.servlet;

import com.medistock.util.DBConnection;
import com.medistock.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/dashboard")
public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws IOException {

        String sql = """
            SELECT
                COUNT(*) AS totalMedicines,
                COALESCE(SUM(quantity), 0) AS totalStock,
                SUM(CASE WHEN quantity <= min_stock THEN 1 ELSE 0 END) AS lowStockItems,
                SUM(CASE WHEN expiry_date < CURDATE() THEN 1 ELSE 0 END) AS expiredItems,
                SUM(CASE WHEN expiry_date BETWEEN CURDATE()
                    AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
                    THEN 1 ELSE 0 END) AS expiringSoonItems
            FROM medicines
            """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            Map<String, Object> dashboard = new HashMap<>();

            if (rs.next()) {
                dashboard.put("totalMedicines", rs.getInt("totalMedicines"));
                dashboard.put("totalStock", rs.getInt("totalStock"));
                dashboard.put("lowStockItems", rs.getInt("lowStockItems"));
                dashboard.put("expiredItems", rs.getInt("expiredItems"));
                dashboard.put("expiringSoonItems", rs.getInt("expiringSoonItems"));
            }

            JsonUtil.sendJson(response, dashboard);

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonUtil.sendJson(response,
                    Map.of("error", "Unable to retrieve dashboard statistics"));
            e.printStackTrace();
        }
    }
}