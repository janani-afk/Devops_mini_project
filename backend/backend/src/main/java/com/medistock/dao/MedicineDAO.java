
package com.medistock.dao;

import com.medistock.model.Medicine;
import com.medistock.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MedicineDAO {

    // 1. Get all medicines
    public List<Medicine> getAllMedicines() throws SQLException {

        List<Medicine> medicines = new ArrayList<>();

        String sql = "SELECT * FROM medicines";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {

                Medicine medicine = new Medicine();

                medicine.setId(String.valueOf(rs.getInt("id")));
                medicine.setName(rs.getString("name"));
                medicine.setCategory(rs.getString("category"));
                medicine.setBatchNumber(rs.getString("batch_number"));
                medicine.setQuantity(rs.getInt("quantity"));
                medicine.setMinStock(rs.getInt("min_stock"));

                Date manufacturingDate =
                        rs.getDate("manufacturing_date");

                if (manufacturingDate != null) {
                    medicine.setManufacturingDate(
                            manufacturingDate.toString());
                }

                Date expiryDate = rs.getDate("expiry_date");

                if (expiryDate != null) {
                    medicine.setExpiryDate(expiryDate.toString());
                }

                medicine.setSupplier(rs.getString("supplier"));

                medicines.add(medicine);
            }
        }

        return medicines;
    }

    // 2. Add a new medicine
    public boolean addMedicine(Medicine medicine) throws SQLException {

        String sql = "INSERT INTO medicines " +
                "(name, category, batch_number, quantity, min_stock, " +
                "manufacturing_date, expiry_date, supplier) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, medicine.getName());
            ps.setString(2, medicine.getCategory());
            ps.setString(3, medicine.getBatchNumber());
            ps.setInt(4, medicine.getQuantity());
            ps.setInt(5, medicine.getMinStock());

            ps.setDate(6, Date.valueOf(
                    medicine.getManufacturingDate()));

            ps.setDate(7, Date.valueOf(
                    medicine.getExpiryDate()));

            ps.setString(8, medicine.getSupplier());

            return ps.executeUpdate() > 0;
        }
    }

    // 3. Update medicine details
    public boolean updateMedicine(Medicine medicine) throws SQLException {

        String sql = "UPDATE medicines SET name=?, category=?, " +
                "batch_number=?, quantity=?, min_stock=?, " +
                "manufacturing_date=?, expiry_date=?, supplier=? " +
                "WHERE id=?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, medicine.getName());
            ps.setString(2, medicine.getCategory());
            ps.setString(3, medicine.getBatchNumber());
            ps.setInt(4, medicine.getQuantity());
            ps.setInt(5, medicine.getMinStock());

            ps.setDate(6, Date.valueOf(
                    medicine.getManufacturingDate()));

            ps.setDate(7, Date.valueOf(
                    medicine.getExpiryDate()));

            ps.setString(8, medicine.getSupplier());
            ps.setInt(9, Integer.parseInt(medicine.getId()));

            return ps.executeUpdate() > 0;
        }
    }

    // 4. Delete a medicine
    public boolean deleteMedicine(String id) throws SQLException {

        String sql = "DELETE FROM medicines WHERE id=?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, Integer.parseInt(id));

            return ps.executeUpdate() > 0;
        }
    }
}
