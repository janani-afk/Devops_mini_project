
package com.medistock.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medistock.dao.MedicineDAO;
import com.medistock.dao.ActivityDAO;
import com.medistock.model.Medicine;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/api/medicines/*")
public class MedicineServlet extends HttpServlet {

    private final MedicineDAO medicineDAO = new MedicineDAO();
    private final ActivityDAO activityDAO = new ActivityDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    // GET: Retrieve all medicines
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            List<Medicine> medicines =
                    medicineDAO.getAllMedicines();

            mapper.writeValue(response.getWriter(), medicines);

        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Unable to retrieve medicines");
        }
    }

    // POST: Add a medicine
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            Medicine medicine = mapper.readValue(
                    request.getInputStream(), Medicine.class);

            boolean result = medicineDAO.addMedicine(medicine);

            if (result) {
                activityDAO.addActivity(
                        medicine.getName(),
                        "Added",
                        "New medicine added to inventory");

                response.setStatus(
                        HttpServletResponse.SC_CREATED);

                response.getWriter().write(
                        "{\"message\":\"Medicine added successfully\"}");

            } else {
                response.sendError(
                        HttpServletResponse.SC_BAD_REQUEST,
                        "Unable to add medicine");
            }

        } catch (SQLException | IllegalArgumentException e) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid medicine details");
        }
    }

    // PUT: Update a medicine
    @Override
    protected void doPut(HttpServletRequest request,
                         HttpServletResponse response)
            throws IOException {

        String id = request.getPathInfo() == null
                ? null : request.getPathInfo().substring(1);

        if (id == null || id.isBlank() || id.contains("/")) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid medicine ID");
            return;
        }

        try {
            Medicine medicine = mapper.readValue(
                    request.getInputStream(), Medicine.class);

            medicine.setId(id);

            boolean result = medicineDAO.updateMedicine(medicine);

            if (result) {
                activityDAO.addActivity(
                        medicine.getName(),
                        "Updated",
                        "Medicine details updated");

                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"message\":\"Medicine updated successfully\"}");

            } else {
                response.sendError(
                        HttpServletResponse.SC_NOT_FOUND,
                        "Medicine not found");
            }

        } catch (SQLException | IllegalArgumentException e) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Unable to update medicine");
        }
    }

    // DELETE: Delete a medicine
    @Override
    protected void doDelete(HttpServletRequest request,
                            HttpServletResponse response)
            throws IOException {

        String id = request.getPathInfo() == null
                ? null : request.getPathInfo().substring(1);

        if (id == null || id.isBlank() || id.contains("/")) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Invalid medicine ID");
            return;
        }

        try {
            boolean result = medicineDAO.deleteMedicine(id);

            if (result) {
                activityDAO.addActivity(
                        "Medicine ID " + id,
                        "Deleted",
                        "Medicine removed from inventory");

                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"message\":\"Medicine deleted successfully\"}");

            } else {
                response.sendError(
                        HttpServletResponse.SC_NOT_FOUND,
                        "Medicine not found");
            }

        } catch (SQLException | NumberFormatException e) {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Unable to delete medicine");
        }
    }
}
