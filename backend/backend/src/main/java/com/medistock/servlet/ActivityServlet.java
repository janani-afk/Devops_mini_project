
package com.medistock.servlet;

import com.medistock.dao.ActivityDAO;
import com.medistock.model.Activity;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/api/activity")
public class ActivityServlet extends HttpServlet {

    private final ActivityDAO activityDAO = new ActivityDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    // GET: Retrieve activity history
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            List<Activity> activities =
                    activityDAO.getAllActivities();

            mapper.writeValue(response.getWriter(), activities);

        } catch (SQLException e) {

            response.sendError(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Unable to retrieve activity history");
        }
    }
}
