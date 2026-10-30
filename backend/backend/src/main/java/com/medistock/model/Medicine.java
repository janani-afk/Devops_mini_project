
package com.medistock.model;

public class Medicine {

    private String id;
    private String name;
    private String category;
    private String batchNumber;
    private int quantity;
    private int minStock;
    private String manufacturingDate;
    private String expiryDate;
    private String supplier;

    // Default constructor
    public Medicine() {
    }

    // Parameterized constructor
    public Medicine(String id, String name, String category,
                    String batchNumber, int quantity, int minStock,
                    String manufacturingDate, String expiryDate,
                    String supplier) {

        this.id = id;
        this.name = name;
        this.category = category;
        this.batchNumber = batchNumber;
        this.quantity = quantity;
        this.minStock = minStock;
        this.manufacturingDate = manufacturingDate;
        this.expiryDate = expiryDate;
        this.supplier = supplier;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getMinStock() {
        return minStock;
    }

    public void setMinStock(int minStock) {
        this.minStock = minStock;
    }

    public String getManufacturingDate() {
        return manufacturingDate;
    }

    public void setManufacturingDate(String manufacturingDate) {
        this.manufacturingDate = manufacturingDate;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }
}
