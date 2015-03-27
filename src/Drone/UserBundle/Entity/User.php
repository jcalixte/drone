<?php

namespace Drone\UserBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Intl\Intl as Intl;
use Doctrine\Common\Collections\ArrayCollection as ArrayCollection;
use Drone\MapBundle\Entity\Map as Map;
use Drone\MapBundle\Entity\Drone as Drone;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 * @Vich\Uploadable
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="firstname", type="string", length=100)
     */
    private $firstname;

    /**
     * @var string
     *
     * @ORM\Column(name="lastname", type="string", length=100)
     */
    private $lastname;

    /**
     * @ORM\OneToMany(targetEntity="Drone\MapBundle\Entity\Field", mappedBy="user", cascade="remove")
     **/
    private $fields;

    /**
     * @ORM\OneToMany(targetEntity="Drone\MapBundle\Entity\Drone", mappedBy="user", cascade="remove")
     **/
    private $drones;

    /**
     * @ORM\OneToMany(targetEntity="Drone\MapBundle\Entity\Point", mappedBy="user", cascade="remove")
     **/
    private $points;

    /**
     * @var string
     *
     * @ORM\Column(name="address", type="string", length=255, nullable=false)
     */
    private $address;

    /**
     * @var string
     *
     * @ORM\Column(name="zipcode", type="string", length=10, nullable=false)
     */
    private $zipcode;

    /**
     * @var string
     *
     * @ORM\Column(name="city", type="string", length=50, nullable=false)
     */
    private $city;

    /**
     * @var string
     *
     * @ORM\Column(name="country", type="string", length=50, nullable=false)
     */
    private $country;

    /**
     * @Vich\UploadableField(mapping="user_image", fileNameProperty="userImage", nullable=true)
     *
     * @var File $imageFile
     */
    protected $imageFile;

    /**
     * @ORM\Column(type="string", length=255, name="user_image", nullable=true)
     *
     * @var string $userImage
     */
    protected $userImage;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @var \DateTime $updatedAt
     */
    protected $updatedAt;

    public function __construct()
    {
        parent::__construct();
        $this->fields = new ArrayCollection();
        $this->drones = new ArrayCollection();
        $this->points = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set firstname
     *
     * @param string $firstname
     * @return User
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname
     *
     * @return string 
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set lastname
     *
     * @param string $lastname
     * @return User
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get lastname
     *
     * @return string 
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile $image
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

        if ($image) {
            $this->updatedAt = new \DateTime('now');
        }
    }

    /**
     * @return File
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @param string $userImage
     */
    public function setUserImage($userImage)
    {
        $this->userImage = $userImage;
    }

    /**
     * @return string
     */
    public function getUserImage()
    {
        return $this->userImage;
    }

    /**
     * Set address
     *
     * @param string $address
     * @return User
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address
     *
     * @return string 
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set zipcode
     *
     * @param string $zipcode
     * @return User
     */
    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    /**
     * Get zipcode
     *
     * @return string 
     */
    public function getZipcode()
    {
        return $this->zipcode;
    }

    /**
     * Set city
     *
     * @param string $city
     * @return User
     */
    public function setCity($city)
    {
        $this->city = $city;

        return $this;
    }

    /**
     * Get city
     *
     * @return string 
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Set country
     *
     * @param string $country
     * @return User
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country
     *
     * @return string 
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return User
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime 
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Add fields
     *
     * @param \Drone\MapBundle\Entity\Field $fields
     * @return User
     */
    public function addField(\Drone\MapBundle\Entity\Field $fields)
    {
        $this->fields[] = $fields;
        $fields->setUser($this);

        return $this;
    }

    /**
     * Remove fields
     *
     * @param \Drone\MapBundle\Entity\Field $fields
     */
    public function removeField(\Drone\MapBundle\Entity\Field $fields)
    {
        $this->fields->removeElement($fields);
        $fields->setUser(null);
    }

    /**
     * Get fields
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getFields()
    {
        return $this->fields;
    }

    /**
     * Add drones
     *
     * @param \Drone\MapBundle\Entity\Drone $drones
     * @return User
     */
    public function addDrone(\Drone\MapBundle\Entity\Drone $drones)
    {
        $this->drones[] = $drones;
        $drones->setUser($this);

        return $this;
    }

    /**
     * Remove drones
     *
     * @param \Drone\MapBundle\Entity\Drone $drones
     */
    public function removeDrone(\Drone\MapBundle\Entity\Drone $drones)
    {
        $this->drones->removeElement($drones);
        $drones->setUser(null);
    }

    /**
     * Get drones
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDrones()
    {
        return $this->drones;
    }

    /**
     * Add points
     *
     * @param \Drone\MapBundle\Entity\Point $points
     * @return User
     */
    public function addPoint(\Drone\MapBundle\Entity\Point $points)
    {
        $this->points[] = $points;
        $points->setUser($this);

        return $this;
    }

    /**
     * Remove points
     *
     * @param \Drone\MapBundle\Entity\Point $points
     */
    public function removePoint(\Drone\MapBundle\Entity\Point $points)
    {
        $this->points->removeElement($points);
        $points->setUser(null);
    }

    /**
     * Get points
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getPoints()
    {
        return $this->points;
    }

    /*==========  Fonction personnalisée  ==========*/
    
    public function getCountryName() {
        return Intl::getRegionBundle()->getCountryName($this->getCountry());
    }
}
