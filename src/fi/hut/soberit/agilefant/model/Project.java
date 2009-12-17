package fi.hut.soberit.agilefant.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.OneToMany;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.joda.time.DateTime;

import flexjson.JSON;

/**
 * A Hibernate entity bean which represents a project.
 * <p>
 * Conceptually, a project is a type of a backlog. A project-backlog represents
 * work (iterations, stories) to be done towards some project
 * outcome (documents, code, plans, etc.).
 * <p>
 * A project is further divided up to smaller containers for work, the
 * iterations. Project also is a part of a bigger container, the product. Since
 * a project is a backlog, it can contain stories, which, in turn, are
 * smaller containers for work.
 * <p>
 * Example projects would be "Acme KillerApp v1.3" or "User Documentation".
 * <p>
 * A project is part of a product. It can contain iterations. It has an optional
 * starting and ending dates, as well as an owner. A project is also bound to
 * some activity type. It also carries information on effort estimations. A
 * project has a rank number, which corresponds to its priority. The rank number
 * doesn't describe the project's absolute rank order; the number must be
 * compared to all other project's ranks to find out rank order.
 * 
 * @see fi.hut.soberit.agilefant.model.Backlog
 * @see fi.hut.soberit.agilefant.model.Story
 * @see fi.hut.soberit.agilefant.model.ProjectType
 * @see fi.hut.soberit.agilefant.model.Iteration
 */
@Entity
@BatchSize(size = 20)
@Audited
public class Project extends Backlog implements Schedulable, Rankable {

    private DateTime endDate;

    private DateTime startDate;

    private int rank = 0;

    private Status status = Status.GREEN;
    
    private Set<Assignment> assignments = new HashSet<Assignment>();
        
    private ExactEstimate baselineLoad = new ExactEstimate(0);
    
    private ExactEstimate backlogSize = new ExactEstimate(0);



    public void setEndDate(DateTime endDate) {
        this.endDate = endDate;
    }

    @JSON
    @Type(type = "org.joda.time.contrib.hibernate.PersistentDateTime")
    public DateTime getEndDate() {
        return endDate;
    }

    public void setStartDate(DateTime startDate) {
        this.startDate = startDate;
    }

    @JSON
    @Type(type = "org.joda.time.contrib.hibernate.PersistentDateTime")
    public DateTime getStartDate() {
        return startDate;
    }

    @Column(nullable = true)
    @JSON
    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    /**
     * Returns the status of the project.
     * 
     * @return the status of the project.
     */
    @Enumerated(EnumType.ORDINAL)
    @JSON
    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    @OneToMany(targetEntity = fi.hut.soberit.agilefant.model.Assignment.class,            
                mappedBy = "backlog")
    @JSON(include = false)
    @NotAudited
    public Set<Assignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(Set<Assignment> assignments) {
        this.assignments = assignments;
    }

    @JSON
    @Embedded
    @AttributeOverrides(@AttributeOverride(name = "minorUnits", column = @Column(name = "backlogSize")))
    public ExactEstimate getBacklogSize() {
        return backlogSize;
    }

    public void setBacklogSize(ExactEstimate backlogSize) {
        this.backlogSize = backlogSize;
    }

    @Embedded
    @AttributeOverrides(@AttributeOverride(name = "minorUnits", column = @Column(name = "baselineLoad")))
    public ExactEstimate getBaselineLoad() {
        return baselineLoad;
    }

    public void setBaselineLoad(ExactEstimate baselineLoad) {
        this.baselineLoad = baselineLoad;
    }

}
