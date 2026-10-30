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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/reports/*")
public class ReportServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws IOException {

        String reportType = request.getPathInfo();

        String sql;

        if ("/inventory".equals(reportType)) {
            sql = "SELECT * FROM medicines ORDER BY name";
        } else if ("/expiry".equals(reportType)) {
            sql = "SELECT * FROM medicines " +
                    "WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 60 DAY) " +
                    "ORDER BY expiry_date";
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            JsonUtil.sendJson(response,
                    Map.of("error", "Report not found"));
            return;
        }

        List<Map<String, Object>> report = new ArrayList<>();

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> medicine = new HashMap<>();

                medicine.put("id", String.valueOf(rs.getInt("id")));
                medicine.put("name", rs.getString("name"));
                medicine.put("category", rs.getString("category"));
                medicine.put("batchNumber", rs.getString("batch_number"));
                medicine.put("quantity", rs.getInt("quantity"));
                medicine.put("minStock", rs.getInt("min_stock"));
                medicine.put("manufacturingDate",
                        rs.getDate("manufacturing_date") == null
                                ? null : rs.getDate("manufacturing_date").toString());
                medicine.put("expiryDate", rs.getDate("expiry_date").toString());
                medicine.put("supplier", rs.getString("supplier"));

                report.add(medicine);
            }

            JsonUtil.sendJson(response, report);

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonUtil.sendJson(response,
                    Map.of("error", "Unable to generate report"));
            e.printStackTrace();
        }
    }
}